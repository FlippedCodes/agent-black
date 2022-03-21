const { messageFail } = require("../../functions_old/GLBLFUNC_messageFail.js");
const { messageSuccess } = require("../../functions_old/GLBLFUNC_messageSuccess.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
	return `Command usage: 
  \`\`\`${prefix}${cmdName} ${subcmd}\`\`\``;
}

module.exports.run = async (client, message, args, config, prefix) => {
	// check BAN_MEMBERS permissions
	if (!await client.functions.get("FUNC_checkPermissionsChannel").run(message.member, message, "BAN_MEMBERS")) {
		messageFail(client, message, `You are not authorized to use \`${prefix}${module.exports.help.name}\``);
		return;
	}

	// get args
	const [userID, reasonTester] = args;
	// check if gived arge are correct
	if (!userID) {
		messageFail(client, message, CommandUsage(prefix, module.exports.help.name, "USERID REASON"));
		return;
	}
	if (isNaN(userID)) {
		messageFail(client, message, CommandUsage(prefix, module.exports.help.name, "USERID REASON"));
		return;
	}
	if (!reasonTester) {
		messageFail(client, message, CommandUsage(prefix, module.exports.help.name, `${userID} REASON`));
		return;
	}
	// check userID if valid
	if (!await client.functions.get("FUNC_checkID").run(userID, client, "user")) {
		messageFail(client, message, `A user with the ID \`${userID}\` doesn't exist!`);
		return;
	}
	// get member
	const toBanMember = await message.guild.members.cache.get(userID);
	// check if member is banned
	if (toBanMember) {
		if (!message.guild.fetchBan(toBanMember.id)) {
			messageFail(client, message, `The user  \`${toBanMember.user.tag}\` can't be unbanned!\nThey are not banned!`);
			return;
		}
	}
	// get complete reason
	const slicedReason = await args.join(" ").slice(userID.length + 1);
	// check ban reason length for discord max ban reason
	if (slicedReason.length > 512) {
		messageFail(client, message, "Your unban reason is too long. Discord only allows a maximum length of 512 characters.");
		return;
	}
	// exec ban
	const processedBanUser = await message.guild.members.unban(userID, slicedReason);
	// write confirmation
	messageSuccess(message, `The user \`${processedBanUser.tag}\` has been unbanned!\nReason: \`\`\`${slicedReason}\`\`\``);
};

module.exports.data = new SlashCommandBuilder()
	.setName("unban")
	.setDescription("Unbans a user.")
	.addUserOption((option) => option.setName("user").setDescription("Provide the user you wish to unban.").setRequired(true))
	.addStringOption((option) => option.setName("reason").setDescription("Reason for the server unban.").setRequired(true));