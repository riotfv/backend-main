import { Hono } from "hono";
import crypto from "node:crypto";
import path from "node:path";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

import cache from "../../misc/middleware/Cache";
import verify from "../../misc/middleware/verify";
import {
  GetDefaultEngine,
  GetDefaultGame,
  GetDefaultRuntimeOptions,
} from "../../utils/cloudstorage/GetHotfixFiles";
import { Errors } from "../../utils/errors/errors";
import Logger from "../../utils/logging/logging";
import ParseUserAgent from "../../utils/useragent/parseUseragent";

interface CloudStorageFile {
  [key: string]: any;
}

interface CloudStorage {
  files: CloudStorageFile[];
}

export default function initRoute(
  router: Hono<{
    Variables: {
      user: any;
      account: any;
      decodedToken: any;
    };
  }>,
) {
  router.get("/fortnite/api/cloudstorage/system", cache, async (c) => {
    const UA = ParseUserAgent(c.req.header("User-Agent"));
    if (!UA) return c.json(Errors.internal.invalidUserAgent, 400);

    const fileContents: { [key: string]: string } = {
      "DefaultEngine.ini": GetDefaultEngine(),
      "DefaultGame.ini": GetDefaultGame(UA.season),
      "DefaultRuntimeOptions.ini": GetDefaultRuntimeOptions(),
    };

    const CloudStorage: CloudStorage = { files: [] };

    for (const [file, content] of Object.entries(fileContents)) {
      CloudStorage.files.push({
        uniqueFilename: file,
        filename: file,
        hash: crypto.createHash("sha1").update(content).digest("hex"),
        hash256: crypto.createHash("sha256").update(content).digest("hex"),
        length: content.length,
        contentType: "application/octet-stream",
        uploaded: "2024-03-03T21:56:36.209-05:00",
        storageType: "S3",
        doNotCache: false,
      });
    }

    c.status(200);
    return c.json(CloudStorage.files);
  });

  router.get("/fortnite/api/cloudstorage/system/:filename", async (c) => {
    const filename = c.req.param("filename");
    const UA = ParseUserAgent(c.req.header("User-Agent"));
    if (!UA) return c.json(Errors.internal.invalidUserAgent, 400);

    switch (filename) {
      case "DefaultEngine.ini":
        c.status(200);
        return c.text(GetDefaultEngine());
      case "DefaultGame.ini":
        c.status(200);
        return c.text(GetDefaultGame(UA.season));
      case "DefaultRuntimeOptions.ini":
        c.status(200);
        return c.text(GetDefaultRuntimeOptions());
      default:
        c.status(400);
        return c.json({
          errorCode: "errors.com.epicgames.bad_request",
          errorMessage: "Hotfix File not found!",
          numericErrorCode: 1001,
          originatingService: "fortnite",
          intent: "prod-live",
        });
    }
  });

  router.get("/fortnite/api/cloudstorage/user/:accountId/:file", verify, async (c) => {
    const clientSettings = path.join(
      process.env.LOCALAPPDATA || process.cwd(),
      "Azura",
      "ClientSettings",
    );

    if (!existsSync(clientSettings)) await mkdir(clientSettings, { recursive: true });

    const file = c.req.param("file");
    const accountId = c.req.param("accountId");

    const clientSettingsFile = path.join(clientSettings, `ClientSettings-${accountId}.Sav`);

    if (file !== "ClientSettings.Sav" || !existsSync(clientSettingsFile)) {
      return c.json(
        Errors.cloudstorage.fileNotFound.originatingService(import.meta.file.replace(".ts", "")),
        404,
      );
    }

    const data = await readFile(clientSettingsFile);

    c.status(200);
    return c.body(data as any);
  });

  router.get("/fortnite/api/cloudstorage/user/:accountId", verify, async (c) => {
    const clientSettings = path.join(
      process.env.LOCALAPPDATA || process.cwd(),
      "Azura",
      "ClientSettings",
    );

    if (!existsSync(clientSettings)) {
      try {
        await mkdir(clientSettings, { recursive: true });
      } catch (err) {
        Logger.error(`Error creating directory: ${String(err)}`);
      }
    }

    const accountId = c.req.param("accountId");
    const clientSettingsFile = path.join(clientSettings, `ClientSettings-${accountId}.Sav`);

    if (!existsSync(clientSettingsFile)) {
      return c.json([]);
    }

    const file = await readFile(clientSettingsFile, "latin1");
    const stats = await stat(clientSettingsFile);

    return c.json([
      {
        uniqueFilename: "ClientSettings.Sav",
        filename: "ClientSettings.Sav",
        hash: crypto.createHash("sha1").update(file).digest("hex"),
        hash256: crypto.createHash("sha256").update(file).digest("hex"),
        length: Buffer.byteLength(file),
        contentType: "application/octet-stream",
        uploaded: stats.mtime,
        storageType: "S3",
        storageIds: {},
        accountId,
        doNotCache: false,
      },
    ]);
  });

  router.put("/fortnite/api/cloudstorage/user/:accountId/:file", verify, async (c) => {
    const raw = await c.req.arrayBuffer();
    const body = Buffer.from(raw);

    if (Buffer.byteLength(body) >= 400000) {
      return c.json(
        Errors.cloudstorage.fileTooLarge.originatingService(import.meta.file.replace(".ts", "")),
        403,
      );
    }

    if (c.req.param("file") !== "ClientSettings.Sav") {
      return c.json(
        Errors.cloudstorage.fileNotFound.originatingService(import.meta.file.replace(".ts", "")),
        404,
      );
    }

    const clientSettings = path.join(
      process.env.LOCALAPPDATA || process.cwd(),
      "Azura",
      "ClientSettings",
    );

    if (!existsSync(clientSettings)) await mkdir(clientSettings, { recursive: true });

    const clientSettingsFile = path.join(
      clientSettings,
      `ClientSettings-${c.req.param("accountId")}.Sav`,
    );

    await writeFile(clientSettingsFile, body, "latin1");
    return c.json([]);
  });
}
