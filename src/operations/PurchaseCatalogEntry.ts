import { Context, Hono } from "hono";
import { BlankInput, Next } from "hono/types";
import { DateTime } from "luxon";
import path from "node:path";
import Accounts from "../misc/models/Accounts";
import Users from "../misc/models/Users";
import GetProfile from "../utils/profile/GetProfile";
import { readFile } from "node:fs/promises";
import { v4 as uuid } from "uuid";
import ParseUserAgent from "../utils/useragent/parseUseragent";
import CommonCoreProfile from "../utils/profile/query/CommonCoreProfile";
import { Errors } from "../utils/errors/errors";
import { isIterationStatement } from "typescript";
import Logger from "../utils/logging/logging";
import RefreshAccount from "./helpers/RefreshAccount";
import { randomUUID } from "node:crypto";

export default async function PurchaseCatalogEntry(
  c: Context<
    {
      Variables: {
        user: any;
        account: any;
        decodedToken: any;
      };
    },
    "/fortnite/api/game/v2/profile/:accountId/client/PurchaseCatalogEntry",
    BlankInput
  >,
  next: Next,
) {
  const profileId = c.req.query("profileId");
  const accountId = c.req.param("accountId");

  const { currency, offerId, purchaseQuantity } = await c.req.json();

  const shopPath = path.join(__dirname, "..", "local", "storefront", "shop.json");

  let applyProfileChanges: any[] = [];
  const notifications: any[] = [];
  const multiUpdates: any[] = [];

  const account = await Accounts.findOne({ accountId });
  const user = await Users.findOne({ accountId });

  if (!account || !user) {
    c.status(400);
    return c.json({
      errorCode: "errors.com.epicgames.common.authentication.authentication_failed",
      errorMessage: `Authentication failed for /api/game/v2/profile/${accountId}/client/PurchaseCatalogEntry`,
      messageVars: [`/api/game/v2/profile/${accountId}/client/PurchaseCatalogEntry`],
      numericErrorCode: 1032,
      originatingService: "any",
      intent: "prod",
      error_description: `Authentication failed for /api/game/v2/profile/${accountId}/client/PurchaseCatalogEntry`,
    });
  }

  const shop = JSON.parse(await readFile(shopPath, "utf-8"));

  const [athena, common_core] = await Promise.all([
    GetProfile(user.accountId, "athena"),
    GetProfile(user.accountId, "common_core"),
  ]);

  const season = ParseUserAgent(c.req.header("User-Agent"));

  const BaseRevision = common_core.rvn;
  const AthenaBaseRevision = athena.rvn;

  if (
    currency === "MtxCurrency" &&
    profileId === "common_core" &&
    offerId &&
    offerId.startsWith("item://")
  ) {
    const id: string = offerId.split("://")[1];
    let currentStorefront: any = null;
    let isItemOwned: boolean = false;
    let purchaseId: string = "";

    for (const storefront of [
      ...shop.catalogItems.BRDailyStorefront,
      ...shop.catalogItems.BRWeeklyStorefront,
    ]) {
      if (storefront.offerId === id) {
        currentStorefront = storefront;
        break;
      }
    }

    if (!currentStorefront) return c.json(Errors.storefront.invalidItem);

    if (purchaseQuantity < 1) {
      c.status(400);
      return c.json({
        errorCode: "errors.com.epicgames.validation.validation_failed",
        errorMessage: "Validation Failed. 'purchaseQuantity' is less than 1.",
        messageVars: [`/api/game/v2/profile/${accountId}/client/PurchaseCatalogEntry`],
        numericErrorCode: 1040,
        originatingService: "any",
        intent: "prod",
        error_description: "Validation Failed. 'purchaseQuantity' is less than 1.",
        error: undefined,
      });
    }

    if (
      !isItemOwned &&
      currentStorefront.price > common_core.items["Currency:MtxPurchased"].quantity
    )
      return c.json(Errors.storefront.currencyInsufficient, 400);

    const itemUUID = uuid();

    const alreadyOwnedItems = currentStorefront.items.filter(
      (item: { item: string }) => athena.items[item.item],
    );
    if (alreadyOwnedItems.length > 0) return c.json(Errors.storefront.alreadyOwned, 400);

    purchaseId = currentStorefront.item;

    athena.items[currentStorefront.item] = {
      templateId: currentStorefront.item,
      attributes: {
        level: 1,
        item_seen: false,
        xp: 0,
        variants: currentStorefront.variants || [],
        favorite: false,
      },
      quantity: 1,
    };

    multiUpdates.push({
      changeType: "itemAdded",
      itemId: currentStorefront.item,
      item: athena.items[currentStorefront.item],
    });

    notifications.push({
      itemType: currentStorefront.item,
      itemGuid: currentStorefront.item,
      itemProfile: "athena",
      quantity: 1,
    });

    for (const bundledItem of currentStorefront.items) {
      athena.items[bundledItem.item] = {
        templateId: bundledItem.item,
        attributes: {
          max_level_bonus: 0,
          level: 1,
          item_seen: false,
          xp: 0,
          variants: bundledItem.variants || [],
          favorite: false,
        },
        quantity: 1,
      };

      notifications.push({
        itemType: bundledItem.item,
        itemGuid: bundledItem.item,
        itemProfile: "athena",
      });

      multiUpdates.push({
        changeType: "itemAdded",
        itemId: bundledItem.item,
        item: athena.items[bundledItem.item],
        quantity: 1,
      });
    }

    for (const item in common_core.items) {
      common_core.items[item].quantity -= currentStorefront.price;

      applyProfileChanges.push({
        changeType: "itemQuantityChanged",
        itemId: item,
        quantity: common_core.items[item].quantity,
      });

      let bundledItems: any[] = [];

      currentStorefront.items.forEach(
        (groupedItem: { item: string; name: string; variants: any[]; categories: string[] }) => {
          bundledItems.push([
            {
              itemType: groupedItem.item || "",
              itemGuid: groupedItem.item || "",
              itemProfile: "athena",
              quantity: 1,
            },
          ]);
        },
      );

      isItemOwned = true;
      break;
    }
  }

  if (multiUpdates.length > 0) {
    athena.rvn += 1;
    athena.commandRevision += 1;
    athena.updatedAt = DateTime.utc().toISO();
  }

  if (applyProfileChanges.length > 0) {
    common_core.rvn += 1;
    common_core.commandRevision += 1;
    common_core.updatedAt = DateTime.utc().toISO();
  }

  await account.updateOne({ $set: { athena, common_core } });
  await RefreshAccount(user.accountId, user.username);

  const profileRevision = season!.buildUpdate >= "12.20" ? athena.commandRevision : athena.rvn;
  const queryRevision = c.req.query("rvn") || 0;

  if (queryRevision !== profileRevision) {
    applyProfileChanges = [
      {
        changeType: "fullProfileUpdate",
        profile: common_core,
      },
    ];
  }

  return c.json({
    profiileRevision: common_core.rvn,
    profileId,
    profileChangesBaseRevision: BaseRevision,
    profileChanges: applyProfileChanges,
    notifications: [
      {
        type: "CatalogPurchase",
        primary: true,
        lootResult: {
          items: notifications,
        },
      },
    ],
    profileCommandRevision: common_core.commandRevision,
    serverTime: DateTime.now().toISO(),
    multiUpdate: [
      {
        profileRevision: athena.rvn,
        profileId: "athena",
        profileChangesBaseRevision: AthenaBaseRevision,
        profileChanges: multiUpdates,
        profileCommandRevision: athena.commandRevision,
      },
    ],
    responseVersion: 1,
  });
}
