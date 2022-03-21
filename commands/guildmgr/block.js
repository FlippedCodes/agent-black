const { messageFail } = require('../../functions_old/GLBLFUNC_messageFail.js');
const { messageSuccess } = require('../../functions_old/GLBLFUNC_messageSuccess.js');
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require('discord.js');

async function blacklistServer(ParticipatingServer, serverID) {
  const success = await ParticipatingServer.update({ blocked: true }, { where: { serverID } })
    .catch(err => {
      if (err) throw err;
    });
  return success[0];
}

/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 * @param {*} ParticipatingServer 
 * @param {Integer} serverID 
 */
module.exports.run = async (client, interaction, ParticipatingServer, serverID) => {
  const serverBlocked = await blacklistServer(ParticipatingServer, serverID);
  if (serverBlocked >= 1) {
    messageSuccess(interaction,
      `The server with the ID \`${serverID}\` got blocked from using the bot.`);
  } else {
    messageFail(client, interaction,
      `The server with the ID \`${serverID}\` couldn't be found of the list.`);
  }
};

module.exports.data = { subcommand: true };
