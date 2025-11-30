const { MessageEmbed } = require('discord.js');

module.exports.run = async (interaction) => {
  // check maintainer permissions
  if (!await client.functions.get('CHECK_DB_perms').run(interaction.user.id, 'staff', interaction.guild.id, interaction.member)) {
    messageFail(interaction, `You are not authorized to use \`/${module.exports.data.name}\``);
    return;
  }
  const embed = new MessageEmbed();
  embed.setColor(16755456);
  embed.setDescription('This command has been deprecated. Use `/memo` instead');
  const channel = await client.channels.cache.get(channelID);
  channel.send({ embeds: [embed] });
};

module.exports.data = new CmdBuilder()
  .setName('warn')
  .setDescription('This command has been deprecated. Use /memo instead.');
