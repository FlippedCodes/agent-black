const { MessageEmbed } = require('discord.js');

module.exports.run = async (interaction) => {
  // check maintainer permissions
  if (!await client.functions.get('CHECK_DB_perms').run(interaction.user.id, 'staff', interaction.guild.id, interaction.member)) {
    messageFail(interaction, `You are not authorized to use \`/${module.exports.data.name}\``);
    return;
  }
  messageFail(interaction, 'This command has been deprecated. Use `/memo` instead');
};

module.exports.data = new CmdBuilder()
  .setName('warn')
  .setDescription('This command has been deprecated. Use /memo instead.');
