const { messageFail } = require('../../functions_old/GLBLFUNC_messageFail.js');
const { messageSuccess } = require('../../functions_old/GLBLFUNC_messageSuccess.js');
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require('discord.js');

async function removeServer(ParticipatingServer, serverID) {
  const success = await ParticipatingServer.update({ active: false },
    { where: { serverID, active: true } })
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
  const serverRemoved = await removeServer(ParticipatingServer, serverID);
  if (serverRemoved >= 1) {
    messageSuccess(interaction,
      `The server with the ID \`${serverID}\` got disabled from the participating Servers list.`);
  } else {
    messageFail(client, interaction,
      `The server with the ID \`${serverID}\` couldn't be found of the list.`);
  }
};

module.exports.data = { subcommand: true };
