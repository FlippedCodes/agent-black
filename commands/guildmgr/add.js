async function addServer(ParticipatingServer, serverID, logChannelID, teamRoleID, serverName) {
  await ParticipatingServer.destroy({ limit: 1, where: { serverID, active: false } });
  const added = await ParticipatingServer.findOrCreate(
    {
      where: { serverID },
      defaults: {
        logChannelID, teamRoleID, serverName, active: true,
      },
    },
  ).catch((err) => console.error(err));
  const created = await added[1];
  return created;
}

module.exports.run = async (interaction, ParticipatingServer, serverID) => {

};

module.exports.data = { subcommand: true };
