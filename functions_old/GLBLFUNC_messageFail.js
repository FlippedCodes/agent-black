const { MessageEmbed } = require("discord.js");

module.exports.messageFail = async (client, interaction, body, keep) => {
	console.log(client, interaction, body, keep);
	const sentMessage = await interaction.followUp({ embeds: [new MessageEmbed({
		title: "",
		description: body,
		color: 16449540
	})], ephemeral: keep ?? false });
	if (!keep) sentMessage.delete({ timeout: 30000 });
	return sentMessage;
};
global.messageFail = module.exports.messageFail();

module.exports.help = {
	name: "GLBLFUNC_messageFail",
};
