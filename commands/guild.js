const ParticipatingServer = require('../database/models/ParticipatingServer');

// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
  return `Command usage: 
    \`\`\`${prefix}${cmdName} ${subcmd}\`\`\``;
}

// check if server has feature enabled.
async function checkFeature(serverID) {
  const found = await ParticipatingServer.findOne({ where: { serverID, active: true } })
    .catch(errHandler);
  return found;
}

// is used to configure settings
// if setting is not set, use default from config
module.exports.run = async (client, message, args, config, prefix) => {
  // TODO: check permissions (Servermanager)
  // check DM
  if (message.channel.type === 'dm') return messageFail(message, 'This comamnd is for servers only.');
  const [subcmd] = args;
  // check userpermissions
  if (!await client.functions.get('FUNC_checkUser').run(message.author.id)) {
    messageFail(message, `You are not authorized to use \`${prefix}${module.exports.help.name} ${subcmd}\``);
    return;
  }
  const commandValues = ['setup', 'disable', 'stats'];
  const currentCMD = module.exports.help;
  if (commandValues.includes(subcmd)) {
    if (subcmd === 'setup' || await checkFeature(message.guild.id)) {
      client.functions.get(`CMD_${currentCMD.name}_${subcmd}`)
        .run(client, message, args, config, prefix);
    } else messageFail(message, 'You cant use this command without setting up your server first!');
  } else messageFail(message, CommandUsage(prefix, currentCMD.name, commandValues.join('|')));
};

module.exports.help = {
  name: 'guild',
  desc: 'Config for setting up your server with the bot.',
};
