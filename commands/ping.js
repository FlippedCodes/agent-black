const { SlashCommandBuilder } = require("@discordjs/builders");
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { reply } = require("../functions/globalFuncs.js");

// Ping kickoff for bot latency
async function kickoff(interaction) {
	const sendMessage = await new MessageEmbed()
		.setDescription("📤 Pong...")
		.setColor();
	const sentMessage = await reply(interaction, { embeds: [sendMessage], fetchReply: true });
	return sentMessage;
}

// message for data return
function editedMessage(sentMessage, interaction) {
	const api_latency = Math.round(sentMessage.client.ws.ping);
	const body = `📥 Pong!
  Bot latency is \`${sentMessage.createdTimestamp - interaction.createdTimestamp}\`ms.
  API latency is \`${api_latency}\`ms`;
	return new MessageEmbed()
		.setDescription(body)
		.setColor();
}

// posts ping message and edits it afterwards
async function checkPing(interaction) {
	const sentReply = await kickoff(interaction);
	reply(interaction, { embeds: [editedMessage(sentReply, interaction)] });
}

/**
 * @param {Client} client
 * @param {CommandInteraction} interaction  
 */
module.exports.run = async (client, interaction) => checkPing(interaction);

module.exports.data = new SlashCommandBuilder()
	.setName("ping")
	.setDescription("Shows API and bot latencies.");