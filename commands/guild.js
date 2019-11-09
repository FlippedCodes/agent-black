const ParticipatingServer = require('../database/models/ParticipatingServer');

// creates a embed messagetemplate for succeded actions
function messageSuccess(client, message, body) {
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 4296754, false);
}

// creates a embed messagetemplate for failed actions
function messageFail(client, message, body) {
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false);
}

// adds a server to the ParticipatingServers table
async function addServer(ParticipatingServer, serverID, logChannelID, teamRoleID, serverName) {
  const added = await ParticipatingServer.findOrCreate(
    {
      where: { serverID },
      defaults: { logChannelID, teamRoleID, serverName },
    },
  ).catch((err) => console.error(err));
  const created = await added[1];
  return created;
}

// removes a server from the ParticipatingServers table
async function removeServer(ParticipatingServer, serverID) {
  const destroyed = await ParticipatingServer.destroy({ limit: 1, where: { serverID } });
  return destroyed;
}

// finds a server in the ParticipatingServers table
async function findServer(ParticipatingServer, serverID) {
  const found = await ParticipatingServer.findOne({ where: { serverID } })
    .catch((err) => console.error(err));
  return found;
}

module.exports.run = async (client, message, args, config) => {
  // get subcmd from args
  const [subcmd, serverID, logChannelID, teamRoleID, serverName] = args;
  // TODO: add teamrole argument (more sucurity command and banwise)

  // check userpermissions
  if (!await client.functions.get('FUNC_checkUser').run(message.author.id)) {
    messageFail(client, message, `You are not authorized to use \`${config.prefix}${module.exports.help.name} ${subcmd}\``);
    return;
  }

  switch (subcmd) {
    // adds a serverentry
    case 'add':
      // check provided information
      if (!serverID || !logChannelID || !teamRoleID || !serverName) {
        messageFail(client, message,
          `Command usage: 
          \`\`\`${config.prefix}${module.exports.help.name} ${subcmd} ${serverID || 'SERVERID'} ${logChannelID || 'LOG-CHANNELID'} ${teamRoleID || 'TEAMROLEID'} SERVERNAME\`\`\``);
        return;
      }
      if (!await client.functions.get('FUNC_checkID').run(logChannelID, client, 'channel')) {
        messageFail(client, message, `The channel with the ID \`${logChannelID}\` doesnt exist!`);
        return;
      }
      if (!await client.functions.get('FUNC_checkID').run(serverID, client, 'server')) {
        messageFail(client, message, `The server with the ID \`${serverID}\` doesn't exist or the bot hasn't been added to the server yet.`);
        return;
      }
      // slice servername
      const slicedServerName = await args.join(' ').slice(subcmd.length + 1 + serverID.length + 1 + logChannelID.length + 1 + teamRoleID.length + 1);
      // add server
      const serverAdded = await addServer(ParticipatingServer, serverID, logChannelID, teamRoleID, slicedServerName);
      // post outcome
      if (serverAdded) {
        messageSuccess(client, message,
          `\`${serverName}\` with the ID \`${serverID}\` got added to the participating Servers list.`);
      } else {
        messageFail(client, message,
          `The entry for the server \`${serverName}\` with the ID \`${serverID}\` already exists!`);
      }
      return;

    // removes a serverentry
    case 'remove':
      if (!serverID) {
        messageFail(client, message,
          `Command usage: 
          \`\`\`${config.prefix}${module.exports.help.name} ${subcmd} SERVERID\`\`\``);
        return;
      }
      const serverRemoved = await removeServer(ParticipatingServer, serverID);
      if (serverRemoved >= 1) {
        messageSuccess(client, message,
          `The server with the ID \`${serverID}\` got removed from the participating Servers list.`);
      } else {
        messageFail(client, message,
          `The server with the ID \`${serverID}\` couldn't be found of the list.`);
      }
      return;

    // shows info about a serverentry
    case 'info':
      if (!serverID) {
        messageFail(client, message,
          `Command usage: 
          \`\`\`${config.prefix}${module.exports.help.name} ${subcmd} SERVERID\`\`\``);
        return;
      }
      const serverFound = await findServer(ParticipatingServer, serverID);
      if (serverFound) {
        messageSuccess(client, message,
          `Servername: \`${serverFound.serverName}\`
          Server ID: \`${serverFound.serverID}\`
          Log Channel: <#${serverFound.logChannelID}> (\`${serverFound.logChannelID}\`)
          Team Role ID: \`${serverFound.teamRoleID}\`
          Participating Server since \`${serverFound.createdAt}\``);
      } else {
        messageFail(client, message,
          `The server with the ID \`${serverID}\` couldn't be found in the list.`);
      }
      return;

    default:
      messageFail(client, message,
        `Command usage: 
        \`\`\`${config.prefix}${module.exports.help.name} ${module.exports.help.usage}\`\`\``);
      return;
  }
};

module.exports.help = {
  name: 'guild',
  usage: 'add|remove|info',
  desc: 'Manages guilds.',
};
