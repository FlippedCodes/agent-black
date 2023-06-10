// adds a Warn to the warning table
async function addWarn(Warn, serverID, userID, reason) {
  await Warn.create({ userID, serverID, reason }).catch(ERR);
}

module.exports.run = async (interaction, warnMessage, Warn, checkforInfectedGuilds) => {
  // get information
  const userID = interaction.options.getUser('user', true).id;
  // add warn
  await addWarn(Warn, interaction.guild.id, userID, warnMessage);
  messageSuccess(interaction, `The user with the ID \`${userID}\` got a new warning added.\n Warning other servers.`);
  checkforInfectedGuilds(interaction.guild, userID, warnMessage);
};

module.exports.data = { subcommand: true };
