const { EmbedBuilder } = require('discord.js');

module.exports.run = async (interaction) => {
  const embed = new EmbedBuilder()
    .setTitle('Halp')
    .setColor(interaction.member.displayColor)
    .setDescription('This command is deprecated, please use discord embedded slash-commands feature instead.')
    .addFields([
      {
        name: 'Still need help?',
        value: `Read the wiki here: https://github.com/FlippedCode/agent-black/wiki
        or join our server here: https://discord.gg/TqBwHtzzhD`,
      }]);
  return reply(interaction, { embeds: [embed] });
};

module.exports.data = new CmdBuilder()
  .setName('help')
  .setDescription('Shows a list of commands. [Deprecated]');
