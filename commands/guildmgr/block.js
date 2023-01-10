async function blacklistServer(ParticipatingServer, serverID) {
  const success = await ParticipatingServer.update({ blocked: true }, { where: { serverID } }).catch(ERR);
  return success[0];
}

module.exports.run = async (interaction, ParticipatingServer, serverID) => {
  const serverBlocked = await blacklistServer(ParticipatingServer, serverID);
  if (serverBlocked >= 1) {
    messageSuccess(interaction,
      `The server with the ID \`${serverID}\` got blocked from using the bot.`);
  } else {
    messageFail(interaction,
      `The server with the ID \`${serverID}\` couldn't be found of the list.`);
  }
};

module.exports.data = { subcommand: true };
