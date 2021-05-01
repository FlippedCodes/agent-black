const ParticipatingServer = require('../database/models/ParticipatingServer');

// adds a server to the ParticipatingServers table
async function addServer(serverID, logChannelID, teamRoleID, serverName) {
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

module.exports.run = async (client, message, args, config, prefix) => {
  // get subcmd from args
  const [subcmd, logChannelID, teamRoleID] = args;
  // check provided information
  if (!logChannelID || !teamRoleID) {
    messageFail(message,
      `Command usage: 
      \`\`\`${prefix}${module.exports.help.parent} ${subcmd} ${logChannelID || 'LOG-CHANNELID'} TEAMROLEID\`\`\``);
    return;
  }
  if (!await client.functions.get('FUNC_checkID').run(logChannelID, client, 'channel')) {
    messageFail(message, `The channel with the ID \`${logChannelID}\` doesn't exist!`);
    return;
  }
  const serverName = message.guild.name;
  const serverID = message.guild.id;
  const serverAdded = await addServer(serverID, logChannelID, teamRoleID, serverName);
  // post outcome
  if (serverAdded) {
    messageSuccess(message,
      `\`${serverName}\` with the ID \`${serverID}\` got added to / updated in the participating Servers list.\nYou can now use all the other commands with this server.`);
  } else {
    messageFail(message,
      `An active server entry for \`${serverName}\` with the ID \`${serverID}\` already exists! If you want to change info, remove it first.`);
  }
};

module.exports.help = {
  name: 'CMD_guild_setup',
  parent: 'guild',
};
