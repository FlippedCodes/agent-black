// adds a user to the Maintainer table
async function addUser(Maintainer, userID) {
  const added = await Maintainer.findOrCreate(
    {
      where: { userID },
    },
  ).catch((err) => console.error(err));
  const created = await added[1];
  return created;
}

// adds user entry
module.exports.run = async (interaction, Maintainer) => {
  const userID = await interaction.options.getUser('user').id;
  // add server
  const userAdded = await addUser(Maintainer, userID);
  // post outcome
  if (userAdded) {
    messageSuccess(interaction,
      `<@${userID}> with the ID \`${userID}\` got added to the maintainers list.`);
  } else {
    messageFail(interaction,
      `The entry for the user <@${userID}> with the ID \`${userID}\` already exists!`);
  }
};

module.exports.data = { subcommand: true };
