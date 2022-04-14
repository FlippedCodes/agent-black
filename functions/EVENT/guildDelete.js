const ParticipatingServer = require('../../database/models/ParticipatingServer');

// removes a server from the ParticipatingServers table
async function removeServer(serverID) {
  const success = await ParticipatingServer.update(
    { active: false },
    { where: { serverID, active: true } },
  ).catch(ERR);
  return success[0];
}

module.exports.run = async (guild) => {
  // check if server is setup
  if (!await client.functions.get('GET_DB_registered').run(guild.id, false)) return;
  await removeServer(guild.id);
};

module.exports.data = {
  name: 'guildDelete',
};
