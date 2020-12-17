const ServerSetting = require('../database/models/ServerSetting');

// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
  return `Command usage: 
    \`\`\`${prefix}${cmdName} ${subcmd}\`\`\``;
}

// check if server has feature enabled.
async function checkFeature(serverID) {
  const found = await ServerSetting.findOne({ where: { serverID, pointsSystemEnabled: true } })
    .catch(errHander);
  return found;
}

// is used to configure settings
// if setting is not set, use default from config
module.exports.run = async (client, message, args, config) => {
  // TODO: check permissions (Servermanager)
  // check DM
  if (message.channel.type === 'dm') return messageFail(message, 'This comamnd is for servers only.');
  // check if user is teammember
  // TODO: update message
  if (!message.member.roles.cache.find(({ id }) => id === config.teamRole)) return messageFail(message, `You are not authorized to use \`${config.prefix}${module.exports.help.name}\``);
  const [subcmd] = args;
  const commandValues = ['enable', 'forceReason', 'pointLifetime', 'listReasons', 'addReason', 'removeReason', 'listPunishment', 'addPunishment', 'removePunishment'];
  const currentCMD = module.exports.help;
  if (commandValues.includes(subcmd)) {
    if (subcmd === 'enable' || await checkFeature(message.guild.id)) {
      client.functions.get(`CMD_${currentCMD.name}_${subcmd}`)
        .run(client, message, args, config);
    } else messageFail(message, `To use the comamnds, you need to enable the feature in this server first: \n${CommandUsage(config.prefix, currentCMD.name, 'enable true')}`);
  } else messageFail(message, CommandUsage(config.prefix, currentCMD.name, commandValues.join('|')));
};

module.exports.help = {
  name: 'punishsettings',
  desc: 'Managing command for setting up pointslists.',
};
