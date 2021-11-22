// finds a user in the Maintainers table
async function findUser(Maintainer, userID) {
  const found = await Maintainer.findOne({ where: { userID } })
    .catch((err) => console.error(err));
  return found;
}

// adds user entry
module.exports.run = async (interaction, Maintainer) => {
  const user = await interaction.options.getUser('user');
  const userID = user.id;
  const userFound = await findUser(Maintainer, userID);
  if (userFound) {
    const userID = userFound.userID;
    messageSuccess(interaction,
      `User tag: <@${userID}> (\`${user.tag}\`)
      User ID: \`${userID}\`
      Maintainer since \`${userFound.createdAt}\``);
  } else {
    messageFail(interaction,
      `The user with the ID \`${userID}\` couldn't be found in the list.`);
  }
};

module.exports.data = { subcommand: true };
