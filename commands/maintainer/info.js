const { messageFail } = require('../../functions_old/GLBLFUNC_messageFail.js');
const { messageSuccess } = require('../../functions_old/GLBLFUNC_messageSuccess.js');
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require('discord.js');

// finds a user in the Maintainers table
async function findUser(Maintainer, userID) {
  const found = await Maintainer.findOne({ where: { userID } })
    .catch((err) => console.error(err));
  return found;
}

// adds user entry
/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 * @param {*} Maintainer 
 */
module.exports.run = async (client, interaction, Maintainer) => {
  const user = interaction.options.getUser('user');
  const userID = user.id;
  const userFound = await findUser(Maintainer, userID);
  if (userFound) {
    const userID = userFound.userID;
    messageSuccess(interaction,
      `User tag: <@${userID}> (\`${user.tag}\`)
      User ID: \`${userID}\`
      Maintainer since \`${userFound.createdAt}\``);
  } else {
    messageFail(client, interaction,
      `The user with the ID \`${userID}\` couldn't be found in the list.`);
  }
};

module.exports.data = { subcommand: true };
