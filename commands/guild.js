const ParticipatingServer = require('../database/models/ParticipatingServer');

const Ban = require('../database/models/Ban');

// adds a server to the ParticipatingServers table
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

// removes a server from the ParticipatingServers table
async function removeServer(ParticipatingServer, serverID) {
  const success = await ParticipatingServer.update({ active: false },
    { where: { serverID, active: true } })
    .catch(errHandler);
  return success[0];
}

// finds a server in the ParticipatingServers table
async function findServer(ParticipatingServer, serverID) {
  const found = await ParticipatingServer.findOne({ where: { serverID } })
    .catch((err) => console.error(err));
  return found;
}

async function getBanCount(serverID) {
  const result = await Ban.findAndCountAll({ where: { serverID } });
  return result.count;
}

module.exports.run = async (client, message, args, config, prefix) => {
  // get subcmd from args
  const [subcmd, serverID, logChannelID, teamRoleID, serverName] = args;

  // check userpermissions
  if (!await client.functions.get('FUNC_checkUser').run(message.author.id)) {
    messageFail(message, `You are not authorized to use \`${prefix}${module.exports.help.name} ${subcmd}\``);
    return;
  }

  // TODO: Split into own files
  switch (subcmd) {
    // adds a serverentry
    case 'add':
      // check provided information
      if (!serverID || !logChannelID || !teamRoleID || !serverName) {
        messageFail(message,
          `Command usage: 
          \`\`\`${prefix}${module.exports.help.name} ${subcmd} ${serverID || 'SERVERID'} ${logChannelID || 'LOG-CHANNELID'} ${teamRoleID || 'TEAMROLEID'} SERVERNAME\`\`\``);
        return;
      }
      if (!await client.functions.get('FUNC_checkID').run(logChannelID, client, 'channel')) {
        messageFail(message, `The channel with the ID \`${logChannelID}\` doesn't exist!`);
        return;
      }
      if (!await client.functions.get('FUNC_checkID').run(serverID, client, 'server')) {
        messageFail(message, `The server with the ID \`${serverID}\` doesn't exist or the bot hasn't been added to the server yet.`);
        return;
      }
      // slice servername
      const slicedServerName = await args.join(' ').slice(subcmd.length + 1 + serverID.length + 1 + logChannelID.length + 1 + teamRoleID.length + 1);
      // add server
      const serverAdded = await addServer(ParticipatingServer, serverID, logChannelID, teamRoleID, slicedServerName);
      // post outcome
      if (serverAdded) {
        messageSuccess(message,
          `\`${slicedServerName}\` with the ID \`${serverID}\` got added to / updated for the participating Servers list.`);
      } else {
        messageFail(message,
          `An active server entry for \`${slicedServerName}\` with the ID \`${serverID}\` already exists! If you want to change info, remove it first.`);
      }
      return;

    // removes a serverentry
    case 'remove':
      if (!serverID) {
        messageFail(message,
          `Command usage: 
          \`\`\`${prefix}${module.exports.help.name} ${subcmd} SERVERID\`\`\``);
        return;
      }
      const serverRemoved = await removeServer(ParticipatingServer, serverID);
      if (serverRemoved >= 1) {
        messageSuccess(message,
          `The server with the ID \`${serverID}\` got disabled from the participating Servers list.`);
      } else {
        messageFail(message,
          `The server with the ID \`${serverID}\` couldn't be found of the list.`);
      }
      return;

    // shows info about a serverentry
    case 'info':
      if (!serverID) {
        messageFail(message,
          `Command usage: 
          \`\`\`${prefix}${module.exports.help.name} ${subcmd} SERVERID\`\`\``);
        return;
      }
      const serverFound = await findServer(ParticipatingServer, serverID);
      if (serverFound) {
        let content = `
        Servername: \`${serverFound.serverName}\`
        Server ID: \`${serverFound.serverID}\`
        Log Channel: <#${serverFound.logChannelID}> (\`${serverFound.logChannelID}\`)
        Team Role ID: \`${serverFound.teamRoleID}\`
        Submitted Bans: \`${await getBanCount(serverID)}\`
        Is server apart of Association: \`${serverFound.active}\``;
        if (serverFound.active) content += `\nParticipating Server since \`${serverFound.updatedAt}\``;
        messageSuccess(message, content);
      } else {
        messageFail(message,
          `The server with the ID \`${serverID}\` couldn't be found in the list.`);
      }
      return;

    default:
      messageFail(message,
        `Command usage: 
        \`\`\`${prefix}${module.exports.help.name} ${module.exports.help.usage}\`\`\``);
      return;
  }
};

module.exports.help = {
  name: 'guild',
  usage: 'add|remove|info SERVERID',
  desc: 'Manages guilds.',
};
