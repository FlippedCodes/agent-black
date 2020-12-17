const ServerSetting = require('../database/models/ServerSetting');

// adds server if not existent

// enables points system
async function enablePointsSystem(serverID) {
  const enabled = await ServerSetting.update({ pointsSystemEnabled: true },
    { where: { serverID } })
    .catch(errHander);
  return enabled;
}

// disables points system
async function disablePointsSystem(serverID) {
  const disabled = await ServerSetting.update({ pointsSystemEnabled: false },
    { where: { serverID } })
    .catch(errHander);
  return disabled;
}

// checks if a DB state is already set
async function checkPointsSystem(serverID, pointsSystemEnabled) {
  const found = await ServerSetting.findOne({ where: { serverID, pointsSystemEnabled } })
    .catch(errHander);
  return found;
}

// checks is server is on list
async function checkServer(serverID, pointsSystemEnabled) {
  const found = await ServerSetting.findOne({ where: { serverID } })
    .catch(errHander);
  return found;
}

module.exports.run = async (client, message, args, config) => {

};

module.exports.help = {
  name: 'CMD_punishsettings_enable',
  parent: 'punishsettings',
};
