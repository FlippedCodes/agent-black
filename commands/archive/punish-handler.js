// module.exports.run = async (message, args, config, prefix) => {
//   // check permissions
//   // check server settings (is punishing feature enabled?)
//   // command handler for subcommands: manualAdd, manualRemove, stats, userStats (calls lookup), add, remove, list, listPunishments
// };

const ServerSetting = require('../../database/models/ServerSetting');

// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
  return `Command usage: 
    \`\`\`/${cmdName} ${subcmd}\`\`\``;
}

// check if server has feature enabled.
async function checkFeature(serverID) {
  const found = await ServerSetting.findOne({ where: { serverID, pointsSystemEnabled: true } })
    .catch(ERR);
  return found;
}

// is used to configure settings
// if setting is not set, use default from config
module.exports.run = async (message, args, config, prefix) => {
  // TODO: check permissions (Servermanager)
  // check DM
  if (message.channel.type === 'dm') return messageFail(message, 'This comamnd is for servers only.');
  // check if user is teammember
  if (!message.member.roles.cache.find(({ id }) => id === config.teamRole)) return messageFail(message, `You are not authorized to use \`/${module.exports.data.name}\``);
  const [subcmd] = args;
  const commandValues = ['manualAdd', 'manualRemove', 'stats', 'userStats(callsLookup)', 'add', 'remove', 'list', 'listPunishments'];
  const currentCMD = module.exports.help;
  if (commandValues.toLowerCase().includes(subcmd)) {
    if (subcmd === 'enable' || await checkFeature(message.guild.id)) {
      client.functions.get(`CMD_${currentCMD.name}_${subcmd}`)
        .run(message, args, config, prefix);
    } else messageFail(message, `To use the comamnds, you need to enable the feature in this server first!\n${CommandUsage(prefix, currentCMD.name, 'enable true')}`);
  } else messageFail(message, CommandUsage(prefix, currentCMD.name, commandValues.join('|')));
};

module.exports.help = {
  name: 'punish',
  desc: 'Punishes a user.',
};
