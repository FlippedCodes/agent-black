const { messageFail } = require('../../functions_old/GLBLFUNC_messageFail.js');
const { messageSuccess } = require('../../functions_old/GLBLFUNC_messageSuccess.js');
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require('discord.js');

// enables guild in ParticipatingServers table
async function enableServer(ParticipatingServer, serverID) {
  const success = await ParticipatingServer.update(
    { active: true },
    { where: { serverID, active: false, blocked: false } },
  )
    .catch(err => {
      if (err) throw err;
    });
  return success[0];
}

// check if server has feature enabled.
async function checkData(ParticipatingServer, serverID) {
  const found = await ParticipatingServer.findOne({
    where: { serverID },
    attributes: ['logChannelID', 'teamRoleID'],
  }).catch(err => {
    if (err) throw err;
  });
  return found;
}

/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 * @param {*} ParticipatingServer 
 */
module.exports.run = async (client, interaction, ParticipatingServer) => {
  const serverID = interaction.guildId;
  if (!await checkData(ParticipatingServer, serverID)) return messageFail(client, interaction, 'You can\'t use this command without setting up your server first!');
  const serverRemoved = await enableServer(ParticipatingServer, serverID);
  if (serverRemoved >= 1) {
    messageSuccess(interaction,
      `The server with the ID \`${serverID}\` got re-enabled in the participating Servers list.`);
  } else {
    messageFail(client, interaction,
      `The server with the ID \`${serverID}\` couldn't be found of the list or is already active.`);
  }
};

module.exports.data = { subcommand: true };
