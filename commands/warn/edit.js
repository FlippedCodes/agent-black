const { messageFail } = require('../../functions_old/GLBLFUNC_messageFail.js');
const { messageSuccess } = require('../../functions_old/GLBLFUNC_messageSuccess.js');
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require('discord.js');

// edits a Warn to the warning table
async function editWarn(Warn, warnID, reason) {
  Warn.update({ reason }, { where: { warnID } })
    .catch(err => {
      if (err) throw err;
    });
}

async function getWarning(warnID) {
  // eslint-disable-next-line no-undef
  const found = await Warn.findOne({ where: { warnID } })
    .catch(err => {
      if (err) throw err;
    });
  return found;
}

/**
 * @param {Client} client
 * @param {CommandInteraction} interaction 
 * @param {String} warnMessage 
 * @param {*} Warn 
 * @param {*} checkforInfectedGuilds 
 */
module.exports.run = async (client, interaction, warnMessage, Warn, checkforInfectedGuilds) => {
  // check if user exists
  // if (isNaN(userIDOrWarnID)) {
  //   messageFail(client, message, 'This is not a warn-ID!');
  //   return;
  // }
  const warnID = interaction.options.getNumber('warnid', true);
  const serverID = interaction.guild.id;
  const warning = await getWarning(warnID);
  // check if warn is existent
  if (!warning) {
    messageFail(client, interaction, 'A Warning with this ID doesn\'t exist!');
    return;
  }
  // check if warn is from the same server
  if (warning.serverID !== serverID) {
    messageFail(client, interaction, 'You can only edit warnings form the server where they have been issued from.');
    return;
  }
  // add warn
  await editWarn(Warn, warnID, warnMessage);
  messageSuccess(interaction, `The warning with the the ID ${warnID} has been edited. Warning other servers.`);
  checkforInfectedGuilds(interaction.guild, warning.userID, warnMessage);
};

module.exports.data = { subcommand: true };
