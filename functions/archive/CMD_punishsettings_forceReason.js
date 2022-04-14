const ServerSetting = require('../../database/models/ServerSetting');

// enables points system
async function enableForceReason(serverID) {
  const enabled = await ServerSetting.update({ pointsSystemForceReason: true },
    { where: { serverID } })
    .catch(ERR);
  return enabled;
}

// disables points system
async function disableForceReason(serverID) {
  const disabled = await ServerSetting.update({ pointsSystemForceReason: false },
    { where: { serverID } })
    .catch(ERR);
  return disabled;
}

module.exports.run = async (message, args, config, prefix) => {
  const [subcmd, enable] = args;
  const lowercaseEnable = enable.toLowerCase();
  const serverID = message.guild.id;
  // check if value is a bool
  if (!(lowercaseEnable === 'true' || lowercaseEnable === 'false')) {
    messageFail(message, CommandUsage(config.prefix, module.exports.help.parent, 'forceReason TRUEORFALSE'));
    return;
  }
  // set value
  let messageState = 'disabled';
  if (lowercaseEnable === 'true') {
    await enableForceReason(serverID);
    messageState = 'enabled';
  } else await disableForceReason(serverID);
  messageSuccess(message, `Successfully ${messageState} setting.`);
};

module.exports.help = {
  name: 'CMD_punishsettings_forceReason',
  parent: 'punishsettings',
};
