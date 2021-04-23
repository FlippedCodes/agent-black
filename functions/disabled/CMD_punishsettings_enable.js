const ServerSetting = require('../database/models/ServerSetting');

// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
  return `Command usage: 
    \`\`\`${prefix}${cmdName} ${subcmd}\`\`\``;
}

// adds server if not existent
async function createServer(serverID) {
  const created = await ServerSetting.findOrCreate({ where: { serverID } }).catch(errHandler);
  return created;
}

// checks is server is on list
async function checkServer(serverID) {
  const found = await ServerSetting.findOne({ where: { serverID } })
    .catch(errHandler);
  return found;
}

// enables points system
async function enablePointsSystem(serverID) {
  const enabled = await ServerSetting.update({ pointsSystemEnabled: true },
    { where: { serverID } })
    .catch(errHandler);
  return enabled;
}

// disables points system
async function disablePointsSystem(serverID) {
  const disabled = await ServerSetting.update({ pointsSystemEnabled: false },
    { where: { serverID } })
    .catch(errHandler);
  return disabled;
}

module.exports.run = async (client, message, args, config) => {
  const serverID = message.guild.id;
  const [subcmd, enable] = args;
  const lowercaseEnable = enable.toLowerCase();
  // check if value is a bool
  if (!(lowercaseEnable === 'true' || lowercaseEnable === 'false')) {
    messageFail(message, CommandUsage(config.prefix, module.exports.help.parent, 'enable TRUEORFALSE'));
    return;
  }
  // check if server exists in list and create it
  const serverExist = await checkServer(serverID);
  if (!serverExist) await createServer(serverID);
  // set value
  let messageState = 'disabled';
  if (lowercaseEnable === 'true') {
    await enablePointsSystem(serverID);
    messageState = 'enabled';
  } else await disablePointsSystem(serverID);
  messageSuccess(message, `Successfully ${messageState} setting.`);
};

module.exports.help = {
  name: 'CMD_punishsettings_enable',
  parent: 'punishsettings',
};
