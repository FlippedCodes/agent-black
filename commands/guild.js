const ParticipatingServer = require('../database/models/ParticipatingServer');

// check if server has feature enabled.
async function checkFeature(serverID) {
  const found = await ParticipatingServer.findOne({ where: { serverID, active: true } })
    .catch(ERR);
  return found;
}

// is used to configure settings
// if setting is not set, use default from config
module.exports.run = async (interaction) => {
  // check MANAGE_GUILD permissions
  if (!interaction.memberPermissions.has('MANAGE_GUILD')) {
    messageFail(message, `You are not authorized to use \`${prefix}${module.exports.help.name}\``);
    return;
  }

  const subName = interaction.options.getString('action', true);
  if (subcmd === 'setup' || subcmd === 'enable' || await checkFeature(interaction.guild.id)) {
    client.commands.get(`${module.exports.data.name}_${subName}`).run(interaction, ParticipatingServer);
  } else messageFail(interaction, 'You can\'t use this command without setting up your server first!');
};

module.exports.data = new CmdBuilder()
  .setName('guild')
  .setDescription('Config for setting up your server with the bot.')
  .addStringOption((option) => option
    .setName('action')
    .setDescription('What do you want with your server?')
    .addChoices([
      ['First time setup.', 'setup'],
      ['View stats.', 'stats'],
      ['Enable this guild.', 'enable'],
      ['Disable this guild.', 'disable'],
    ])
    .setRequired(true));
