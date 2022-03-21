const { messageFail } = require("../../functions_old/GLBLFUNC_messageFail.js");
const { messageSuccess } = require("../../functions_old/GLBLFUNC_messageSuccess.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");

/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
module.exports.run = async (client, interaction) => {
	// check BAN_MEMBERS permissions
	if (!interaction.memberPermissions.has("BAN_MEMBERS")) {
		messageFail(client, interaction, `You are not authorized to use \`/${module.exports.data.name}\``);
		return;
	}

	// get user
	const userOpt = interaction.options.get("user", true);
	// check if member is bannable
	if (userOpt.member) {
		if (!userOpt.member.bannable) {
			messageFail(client, interaction, `The user  \`${userOpt.user.tag}\` can't be banned!\nHe owns the server, has higher permissions or is a system user!`);
			return;
		}
	}

	// value definitions
	const user = userOpt.user;
	const guild = interaction.guild;
	const userID = user.id;
	// check if user is already banned
	const banList = await guild.bans.fetch();
	const existingBan = await banList.find((ban) => ban.user.id === userID);
	// unbanning so reason gets updated
	if (existingBan) await guild.members.unban(userID);
	// get complete reason
	const reason = interaction.options.getString("reason", true);
	// check ban reason length for discord max ban reason
	if (reason.length > 512) {
		messageFail(client, interaction, "Your ban reason is too long. Discord only allows a maximum length of 512 characters.");
		return;
	}
	// exec ban
	const processedBanUser = await guild.members.ban(userID, { reason });
	// write confirmation
	messageSuccess(interaction, `The user \`${processedBanUser.tag}\` has been banned!\nReason: \`\`\`${reason}\`\`\``);
};

module.exports.data = new SlashCommandBuilder()
	.setName("ban")
	.setDescription("Bans a user.")
	.addUserOption((option) => option.setName("user").setDescription("Provide the user you wish to ban.").setRequired(true))
	.addStringOption((option) => option.setName("reason").setDescription("Reason for the server ban.").setRequired(true));
