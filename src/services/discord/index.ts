import { Client, Collection, GatewayIntentBits } from "discord.js";
import type { ExtendedClient } from "./botinterfaces/ExtendedClient";
import type BaseCommand from "./helpers/BaseCommand";
import EventHandler from "./handlers/EventHandler";
import CommandHandler from "./handlers/CommandHandler";
import { env } from "../..";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
}) as ExtendedClient;

client.commands = new Collection<string, BaseCommand>();

EventHandler(client);
await CommandHandler(client);

client.login(process.env.BOT_TOKEN || "default-bot-token");
