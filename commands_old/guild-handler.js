const ParticipatingServer = require('../database/models/ParticipatingServer');

// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
  return `Command usage: 
    \`\`\`${prefix}${cmdName} ${subcmd}\`\`\``;
}

// check if server has feature enabled.
async function checkFeature(serverID) {
  const found = await ParticipatingServer.findOne({ where: { serverID, active: true } })
    .catch(ERR);
  return found;
}

// is used to configure settings
// if setting is not set, use default from config
module.exports.run = async (client, message, args, config, prefix) => {
  // check MANAGE_GUILD permissions
  if (!await client.functions.get('FUNC_checkPermissionsChannel').run(message.member, message, 'MANAGE_GUILD')) {
    messageFail(message, `You are not authorized to use \`${prefix}${module.exports.help.name}\``);
    return;
  }

  const [subcmd] = args;
  const commandValues = ['setup', 'disable', 'enable', 'stats'];
  const currentCMD = module.exports.help;
  if (commandValues.includes(subcmd)) {
    if (subcmd === 'setup' || subcmd === 'enable' || await checkFeature(message.guild.id)) {
      client.functions.get(`CMD_${currentCMD.name}_${subcmd}`)
        .run(client, message, args, config, prefix);
    } else messageFail(message, 'You can\'t use this command without setting up your server first!');
  } else messageFail(message, CommandUsage(prefix, currentCMD.name, commandValues.join('|')));
};

module.exports.help = {
  name: 'guild',
  usage: 'setup|disable|enable|stats',
  desc: 'Config for setting up your server with the bot.',
};
