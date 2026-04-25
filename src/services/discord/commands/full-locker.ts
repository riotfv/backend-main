import {
  ApplicationCommandOptionType,
  type CommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  type CacheType,
  GuildMemberRoleManager,
  Role,
} from "discord.js";
import BaseCommand from "../helpers/BaseCommand";
import path from "node:path";
import Users from "../../../misc/models/Users";
import Accounts from "../../../misc/models/Accounts";

export default class FullLockerCommand extends BaseCommand {
  data = {
    name: "full-locker",
    description: "Gives a user full locker",
    options: [
      {
        name: "user",
        type: ApplicationCommandOptionType.User,
        description: "The user you want to give full locker.",
        required: true,
      },
    ],
    defaultMemberPermissions: PermissionFlagsBits.BanMembers.toString(),
    dmPermission: false,
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async execute(interaction: CommandInteraction<CacheType>): Promise<any> {
    await interaction.deferReply({ ephemeral: true });

    const user_data = await interaction.options.get("user", true);

    const user = await Users.findOne({ discordId: user_data.user?.id });

    if (!interaction.memberPermissions?.has("BanMembers"))
      return await interaction.editReply({
        content: "You do not have permission to use this command.",
      });

    if (!user) {
      const embed = new EmbedBuilder()
        .setTitle("User not found.")
        .setDescription("Failed to find user, please try again.")
        .setColor("Red")
        .setTimestamp();

      return await interaction.editReply({ embeds: [embed as any] });
    }

    const account = await Accounts.findOne({ discordId: user.discordId });

    if (!account) {
      const embed = new EmbedBuilder()
        .setTitle("Account not found.")
        .setDescription("Failed to find account, please try again.")
        .setColor("Red")
        .setTimestamp();

      return await interaction.editReply({ embeds: [embed as any] });
    }

    if (user.banned) {
      const embed = new EmbedBuilder()
        .setTitle("User is Banned")
        .setDescription("This user is banned.")
        .setColor("Red")
        .setTimestamp();

      return await interaction.editReply({ embeds: [embed as any] });
    }

    if (user.hasFL) {
      const embed = new EmbedBuilder()
        .setTitle("Already has full locker.")
        .setDescription("This user already has full locker.")
        .setColor("Red")
        .setTimestamp();

      return await interaction.editReply({ embeds: [embed as any] });
    }

    await user.updateOne({ hasFL: true });

    const All = await Bun.file(
      path.join(__dirname, "..", "..", "..", "utils", "profile", "profiles", "AllCosmetics.json"),
    ).json();

    await account.updateOne({ $set: { "athena.items": All } });

    const embed = new EmbedBuilder()
      .setTitle("Success")
      .setDescription(`Successfully granted full locker to ${user_data.user?.username}'s account.`)
      .setColor("Green")
      .setTimestamp();

    return await interaction.editReply({ embeds: [embed as any] });
  }
}
