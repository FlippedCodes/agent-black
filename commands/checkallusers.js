const { messageFail } = require("../functions_old/GLBLFUNC_messageFail.js");
const { messageSuccess } = require("../functions_old/GLBLFUNC_messageSuccess.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, Snowflake } = require("discord.js");
const { reply } = require("../functions/globalFuncs.js");

const ParticipatingServer = require("../database/models/ParticipatingServer");

const Ban = require("../database/models/Ban");

const buttons = new MessageActionRow()
	.addComponents([
		new MessageButton()
			.setCustomId("accept")
			.setEmoji("✅")
			.setLabel("Show 'em all")
			.setStyle("PRIMARY"),
		new MessageButton()
			.setCustomId("deny")
			.setEmoji("❌")
			.setLabel("Abort")
			.setStyle("SECONDARY"),
	]);

async function getBanns(userID) {
	const found = await Ban.findAll({ where: { userID } }).catch(err => {
		if (err) throw err;
	});
	return found;
}

// send message when user is banned
/**
 * @param {CommandInteraction} interaction 
 * @param {String} serverName 
 * @param {Snowflake} serverID 
 * @param {Snowflake} userID 
 * @param {String} userTag 
 */
async function sendBanMessage(interaction, serverName, serverID, userID, userTag) {
	const message = await new MessageEmbed()
		.setDescription(`serverID: \`${serverID}\`
    servername: \`${serverName}\`
    userID: \`${userID}\`
    username: \`${userTag}\``)
		.setFooter({ text: `For more information use \`/lookup ${userID}\`` })
		.setColor(16739072);
	reply(interaction, { embeds: [message] }, true);
}

async function getServerName(serverID) {
	// adds a user to the Maintainer table
	const found = await ParticipatingServer.findOne({ where: { serverID } })
		.catch((err) => console.error(err));
	if (!found) return "unknown server";
	return found.serverName;
}

async function postBans(allBans, interaction) {
	await messageSuccess(interaction, "Starting... Please note, because of Discords API limit, the messages take some time to process.");
	allBans.forEach(async (foundBan) => {
		const serverID = foundBan.serverID;
		sendBanMessage(interaction, await getServerName(serverID), serverID, foundBan.userID, foundBan.userTag);
	});
}

/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
module.exports.run = async (client, interaction) => {
	// check MANAGE_GUILD permissions
	if (!interaction.memberPermissions.has("MANAGE_GUILD")) {
		messageFail(client, interaction, `You are not authorized to use \`/${module.exports.data.name}\``);
		return;
	}

	// get all userIDs
	const users = await interaction.guild.members.fetch({ cache: false });
	const IDs = users.map((user) => user.id);
	// get all user bans
	const allBans = await getBanns(IDs);
	if (allBans.length === 0) return messageSuccess(interaction, "Your server is clear! No known users so far.");
	// check if up to 5 entries
	if (allBans.length < 5) return postBans(allBans, interaction);

	const message = await new MessageEmbed()
		.setDescription(`The bot is about to spam ${allBans.length} listed bans into this channel! This action can not be stopped midway through. \nAre you sure?`)
		.setColor(16739072);
	const confirmMessage = await reply(interaction, {
		embeds: [message], components: [buttons], fetchReply: true, ephemeral: true,
	});

	// start button collector
	const filter = (i) => interaction.user.id === i.user.id;
	const buttonCollector = confirmMessage.createMessageComponentCollector({ filter, time: 10000 });
	buttonCollector.on("collect", async (used) => {
		buttonCollector.stop();
		if (used.customId === "accept") return postBans(allBans, interaction);
		return messageFail(client, interaction, "Aborted!");
	});
	buttonCollector.on("end", async (collected) => {
		if (collected.size === 0) messageFail(client, interaction, "Your response took too long. Please run the command again.");
	});
};

module.exports.data = new SlashCommandBuilder()
	.setName("checkallusers")
	.setDescription("Checks all users in current server, if found on banlist.");
