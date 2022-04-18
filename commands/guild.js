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
    messageFail(interaction, `You are not authorized to use \`/${module.exports.data.name}\``);
    return;
  }

  const subName = interaction.options.getSubcommand(true);
  if (subName === 'setup' || subName === 'enable' || await checkFeature(interaction.guild.id)) {
    client.commands.get(`${module.exports.data.name}_${subName}`).run(interaction, ParticipatingServer);
  } else messageFail(interaction, 'You can\'t use this command without setting up your server first!');
};

module.exports.data = new CmdBuilder()
  .setName('guild')
  .setDescription('Config for setting up your server with the bot.')
  .addSubcommand((SC) => SC
    .setName('setup')
    .setDescription('First time setup.')
    .addChannelOption((option) => option
      .setName('channel')
      .setDescription('Provide a channel you want Agent Black to report to.')
      .addChannelType(0)
      .setRequired(true))
    .addRoleOption((option) => option
      .setName('role')
      .setDescription('Provide your teams role, so the bot know who to listen to.')
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('stats')
    .setDescription('View stats.'))
  .addSubcommand((SC) => SC
    .setName('enable')
    .setDescription('Enable this guild.'))
  .addSubcommand((SC) => SC
    .setName('disable')
    .setDescription('Disable this guild.'));
