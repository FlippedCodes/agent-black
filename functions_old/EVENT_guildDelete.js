const ParticipatingServer = require('../database/models/ParticipatingServer');

const errHandler = (err) => {
  console.error('ERROR:', err);
};

// removes a server from the ParticipatingServers table
async function removeServer(serverID) {
  const success = await ParticipatingServer.update(
    { active: false },
    { where: { serverID, active: true } },
  )
    .catch(errHandler);
  return success[0];
}

module.exports.run = async (client, guild) => {
  await removeServer(guild.id);
};

module.exports.help = {
  name: 'EVENT_guildDelete',
};
