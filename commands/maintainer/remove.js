const { messageFail } = require('../../functions_old/GLBLFUNC_messageFail.js');
const { messageSuccess } = require('../../functions_old/GLBLFUNC_messageSuccess.js');
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require('discord.js');

// removes a user from the Maintainer table
async function removeUser(Maintainer, userID) {
  const destroyed = await Maintainer.destroy({ limit: 1, where: { userID } });
  return destroyed;
}

// adds user entry
/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 * @param {*} Maintainer 
 */
module.exports.run = async (client, interaction, Maintainer) => {
  const userID = await interaction.options.getUser('user').id;
  if (userID === interaction.user.id) return messageFail(client, interaction, 'You cant edit yourself.');
  const userRemoved = await removeUser(Maintainer, userID);
  if (userRemoved >= 1) {
    messageSuccess(interaction,
      `The user with the ID \`${userID}\` got removed from the maintainers list.`);
  } else {
    messageFail(client, interaction,
      `The user with the ID \`${userID}\` couldn't be found of the list.`);
  }
};

module.exports.data = { subcommand: true };
