const { messageFail } = require("../functions_old/GLBLFUNC_messageFail.js");
const { messageSuccess } = require("../functions_old/GLBLFUNC_messageSuccess.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

const ParticipatingServer = require("../database/models/ParticipatingServer");

function getChannels() {
	return ParticipatingServer.findAll({ where: { active: true, blocked: false }, attributes: ["logChannelID"] })
		.catch((err) => console.error(err));
}

async function sendMessage(client, author, body) {
	const channels = await getChannels();
	channels.forEach((DBchannel) => {
		const channelID = DBchannel.logChannelID;
		const channel = client.channels.cache.find((channel) => channel.id === channelID);
		const embed = new MessageEmbed()
			.setAuthor({ name: `${author} broadcasted` })
			.setDescription(body)
			.setColor(4182379);
		channel.send({ embeds: [embed] });
	});
}

/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 * @returns 
 */
module.exports.run = async (client, interaction) => {
	// check maintainer permissions
	if (!await client.functions.get("CHECK_DB_perms").run(interaction.user.id)) {
		messageFail(client, interaction, `You are not authorized to use \`/${module.exports.data.name}\``);
		return;
	}
	const body = interaction.options.getString("message", true);
	await messageSuccess(interaction, "Sending messages...");
	await sendMessage(client, interaction.user.tag, body);
	await messageSuccess(interaction, "Sent messages to all servers!");
};

module.exports.data = new SlashCommandBuilder()
	.setName("broadcast")
	.setDescription("Broadcasts a message to all servers.")
	.addStringOption((option) => option.setName("message").setDescription("Message that should be broadcasted").setRequired(true));
