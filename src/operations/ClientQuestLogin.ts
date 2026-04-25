import { Context } from "hono";
import { BlankInput } from "hono/types";
import { DateTime } from "luxon";
import GetProfile from "../utils/profile/GetProfile";
import Accounts from "../misc/models/Accounts";
import ParseUserAgent from "../utils/useragent/parseUseragent";
import RefreshAccount from "./helpers/RefreshAccount";
import Users from "../misc/models/Users";
import CommonCoreProfile from "../utils/profile/query/CommonCoreProfile";
import { Errors } from "../utils/errors/errors";

export default async function ClientQuestLogin(
  c: Context<
    {
      Variables: {
        user: any;
        account: any;
        decodedToken: any;
      };
    },
    "/fortnite/api/game/v2/profile/:accountId/client/ClientQuestLogin",
    BlankInput
  >,
) {
  const profileId = c.req.query("profileId");
  const accountId = c.req.param("accountId");

  const account = await Accounts.findOne({ accountId });
  const user = await Users.findOne({ accountId });

  if (!account || !user) return c.json(Errors.account.accountNotFound, 404);

  const athena = await GetProfile(accountId, "athena");

  if (!athena) return c.json(Errors.mcp.profileNotFound, 404);

  const common_core = await GetProfile(accountId, "common_core");

  if (!common_core) return c.json(Errors.mcp.profileNotFound, 404);

  const BaseRevision = athena.rvn || 0;

  const applyProfileChanges: any[] = [];
  let multiUpdates: any = [];

  if (multiUpdates.length > 0) {
    athena.rvn += 1;
    athena.commandRevision += 1;
    athena.updatedAt = DateTime.now().toISO();
  }

  await account.updateOne({ $set: { athena, common_core } });
  await RefreshAccount(user.accountId, user.username);

  return c.json({
    profileRevision: athena.rvn,
    profileId: "athena",
    profileChangesBaseRevision: BaseRevision,
    profileChanges: multiUpdates,
    profileCommandRevision: athena.rvn,
    serverTime: DateTime.now().toISO(),
    responseVersion: 1,
  });
}
