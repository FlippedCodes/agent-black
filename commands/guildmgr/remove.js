async function removeServer(ParticipatingServer, serverID) {
  const success = await ParticipatingServer.update({ active: false },
    { where: { serverID, active: true } })
    .catch(ERR);
  return success[0];
}

module.exports.run = async (interaction, ParticipatingServer, serverID) => {

};

module.exports.data = { subcommand: true };
