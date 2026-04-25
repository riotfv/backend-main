import { resolve } from "path";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import logging from "../logging/logging";

export const configSchema = z.object({
  PORT: z.number(),
  XMPP_PORT: z.number(),
  ENABLE_LOGS: z.boolean(),
  MATCHMAKER_PORT: z.number(),
  ENABLE_TLS: z.boolean(),
  AutoRotate: z.boolean(),
});

class Config {
  private static validatedConfig: z.infer<typeof configSchema>;

  public static config: z.infer<typeof configSchema>;

  public static validate(): z.infer<typeof configSchema> {
    const configFile = ".env";

    dotenv.config({ path: resolve(process.cwd(), "config", configFile) });

    const PORT = parseInt(Bun.env.PORT as string, 10);
    const XMPP_PORT = parseInt(Bun.env.XMPP_PORT as string, 10);
    const ENABLE_LOGS = Bun.env.ENABLE_LOGS === "true";
    const MATCHMAKER_PORT = parseInt(Bun.env.MATCHMAKER_PORT as string, 10);
    const ENABLE_TLS = Bun.env.ENABLE_TLS === "true";
    const AutoRotate = Bun.env.AutoRotate === "true";

    const unsafeConfig = configSchema.safeParse({
      PORT,
      XMPP_PORT,
      ENABLE_LOGS,
      MATCHMAKER_PORT,
      ENABLE_TLS,
      AutoRotate,
    });

    if (!unsafeConfig.success) throw new Error(unsafeConfig.error.message);

    this.validatedConfig = unsafeConfig.data;

    return unsafeConfig.data;
  }

  public static register(): z.infer<typeof configSchema> {
    this.validate();

    logging.info("Config registered");
    this.config = this.validatedConfig;
    return this.config;
  }
}

export default Config;
