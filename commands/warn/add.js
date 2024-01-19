// adds a Warn to the warning table
async function addWarn(Warn, serverID, userID, reason) {
  await Warn.create({ userID, serverID, reason }).catch(ERR);
}

module.exports.run = async (interaction, warnMessage, Warn, checkforInfectedGuilds) => {
  // get information
  const userID = interaction.options.getUser('user', true).id;
  // checking if user is AB
  if (userID === client.user.id) return messageFail(interaction, 'You can\'t warn the bot itself!');
  // add warn
  await addWarn(Warn, interaction.guild.id, userID, warnMessage);
  messageSuccess(interaction, `The user with the ID \`${userID}\` got a new warning added.\n Warning other servers.`);
  checkforInfectedGuilds(interaction.guild, userID, warnMessage);
};

module.exports.data = { subcommand: true };
