// removes a user from the Maintainer table
async function removeUser(Maintainer, userID) {
  const destroyed = await Maintainer.destroy({ limit: 1, where: { userID } });
  return destroyed;
}

// adds user entry
module.exports.run = async (interaction, Maintainer) => {
  const userID = await interaction.options.getUser('user').id;
  const userRemoved = await removeUser(Maintainer, userID);
  if (userRemoved >= 1) {
    messageSuccess(interaction,
      `The user with the ID \`${userID}\` got removed from the maintainers list.`);
  } else {
    messageFail(interaction,
      `The user with the ID \`${userID}\` couldn't be found of the list.`);
  }
};

module.exports.data = { subcommand: true };
