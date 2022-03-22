const ServerSetting = require('../../database/models/ServerSetting');
const { messageFail } = require('../../functions_old/GLBLFUNC_messageFail.js');
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, Message } = require('discord.js');

// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
  return `Command usage: 
    \`\`\`/${cmdName} ${subcmd}\`\`\``;
}

// check if server has feature enabled.
async function checkFeature(serverID) {
  const found = await ServerSetting.findOne({ where: { serverID, pointsSystemEnabled: true } })
    .catch(err => {
      throw err;
    });
  return found;
}

// is used to configure settings
// if setting is not set, use default from config
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 * @param {*} config 
 * @param {String} prefix 
 */
module.exports.run = async (client, message, args, config, prefix) => {
  // TODO: check permissions (Servermanager)
  // check DM
  if (message.channel.type === 'dm') return messageFail(client, message, 'This comamnd is for servers only.');
  // check if user is teammember
  if (!message.member.roles.cache.find(({ id }) => id === config.teamRole)) return messageFail(client, message, `You are not authorized to use \`/${module.exports.data.name}\``);
  const [subcmd] = args;
  const commandValues = ['enable', 'listSettings', 'forceReason', 'pointLifetime', 'listReasons', 'addReason', 'removeReason', 'listPunishment', 'addPunishment', 'removePunishment'];
  const currentCMD = module.exports.help;
  if (commandValues.toLowerCase().includes(subcmd)) {
    if (subcmd === 'enable' || await checkFeature(message.guild.id)) {
      client.functions.get(`CMD_${currentCMD.name}_${subcmd}`)
        .run(client, message, args, config, prefix);
    } else messageFail(client, message, `To use the comamnds, you need to enable the feature in this server first!\n${CommandUsage(prefix, currentCMD.name, 'enable true')}`);
  } else messageFail(client, message, CommandUsage(prefix, currentCMD.name, commandValues.join('|')));
};

module.exports.help = {
  name: 'punishsettings',
  desc: 'Managing command for setting up pointslists.',
};
