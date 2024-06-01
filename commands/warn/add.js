// adds a Warn to the warning table
async function addWarn(Warn, serverID, userID, reason) {
  await Warn.create({ userID, serverID, reason }).catch(ERR);
}

module.exports.run = async (interaction, warnMessage, Warn, checkforInfectedGuilds) => {
  // get information
  const user = interaction.options.getUser('user', true);
  const userID = user.id;
  // check if user is a bot
  if (user.bot) return messageFail(interaction, 'This user is a bot and cannot be warned.');
  // checking if user is AB
  if (userID === client.user.id) return messageFail(interaction, 'You can\'t warn the bot itself!');
  // add warn
  await addWarn(Warn, interaction.guild.id, userID, warnMessage);
  messageSuccess(interaction, `The user with the ID \`${userID}\` got a new warning added.\nWarning other servers.\nPlease keep in mind: The warning feature is not a way to reach out to the user!`);
  checkforInfectedGuilds(interaction.guild, userID, warnMessage);
};

module.exports.data = { subcommand: true };
