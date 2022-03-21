const { messageFail } = require('../../functions_old/GLBLFUNC_messageFail.js');
const { messageSuccess } = require('../../functions_old/GLBLFUNC_messageSuccess.js');
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require('discord.js');

async function addServer(ParticipatingServer, serverID, logChannelID, teamRoleID, serverName) {
  await ParticipatingServer.destroy({ limit: 1, where: { serverID, active: false } });
  const added = await ParticipatingServer.findOrCreate(
    {
      where: { serverID },
      defaults: {
        logChannelID, teamRoleID, serverName, active: true,
      },
    },
  ).catch((err) => console.error(err));
  const created = await added[1];
  return created;
}

/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 * @param {*} ParticipatingServer 
 * @param {Integer} serverID 
 */
module.exports.run = async (client, interaction, ParticipatingServer, serverID) => {
  // FIXME: no valid check of provided IDs
  const logChannelID = interaction.options.getString('channel', true);
  const teamRoleID = interaction.options.getString('role', true);
  const serverName = await interaction.client.guilds.cache.find((guild) => guild.id === serverID).name;
  // add server
  const serverAdded = await addServer(ParticipatingServer, serverID, logChannelID, teamRoleID, serverName);
  // post outcome
  if (serverAdded) {
    messageSuccess(interaction,
      `\`${serverName}\` with the ID \`${serverID}\` got added to / updated for the participating Servers list and marked as active.`);
  } else {
    messageFail(client, interaction,
      `An active server entry for \`${serverName}\` with the ID \`${serverID}\` already exists! If you want to change info, remove it first.`);
  }
};

module.exports.data = { subcommand: true };
