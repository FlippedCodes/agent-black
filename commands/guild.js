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
async function addServer(ParticipatingServer, serverID, logChannelID, serverName) {
  const added = await ParticipatingServer.findOrCreate(
    {
      where: { serverID },
      defaults: { logChannelID, serverName },
    },
  ).catch((err) => console.error(err));
  // FIXME: always returns false
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
  const [subcmd, serverID, logChannelID] = args;
  const serverName = await args.join(' ').slice(subcmd.length + 1 + serverID.length + 1 + logChannelID.length + 1);

  // TODO: make admin table for permissions to use this command
  // TODO: make sure id is a serverID/nummeric ID and give comment usage if wrong
  // TODO: check if all craterias is given
  // TODO: (check if bot is on server and serverID can be resolved)

  switch (subcmd) {
    // adds a serverentry
    case 'add':
      if (!serverID || !logChannelID || !serverName) {
        messageFail(client, message,
          `Command usage: 
          \`\`\`${config.prefix}${module.exports.help.name} ${subcmd} ${serverID || 'SERVERID'} ${logChannelID || 'LOG-CHANNELID'} SERVERNAME\`\`\``);
        return;
      }
      const serverAdded = await addServer(ParticipatingServer, serverID, logChannelID, slicedServerName);
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
          \`\`\`${config.prefix}${module.exports.help.name} ${subcmd} ${serverID || 'SERVERID'}\`\`\``);
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
      const serverFound = await findServer(ParticipatingServer, serverID);
      if (serverFound) {
        messageSuccess(client, message,
          `Servername: \`${serverFound.serverName}\`
          Server ID: \`${serverFound.serverID}\`
          Log Channel: <#${serverFound.logChannelID}> (\`${serverFound.logChannelID}\`)
          Participating Server since \`${serverFound.createdAt}\``);
      } else {
        messageFail(client, message,
          `The server with the ID \`${serverID}\` couldn't be found in the list.`);
      }
      return;

    default:
      messageFail(client, message,
        `Command usage: 
        \`\`\`${config.prefix}${module.exports.help.name} add|remove|info\`\`\``);
      return;
  }
};

module.exports.help = {
  name: 'guild',
};
