async function blacklistServer(serverID) {
  const success = await ParticipatingServer.update({ blocked: true }, { where: { serverID } }).catch(ERR);
  return success[0];
}

module.exports.run = async (interaction, ParticipatingServer, serverID) => {

};

module.exports.data = { subcommand: true };
