module.exports.run = async (client, message, args, config) => {
  // get subcmd from args
  const [subcmd, userIDOrWarnID, reasonTesting, editReasonTesting] = args;

  // check userpermissions
  if (!await client.functions.get('FUNC_checkUser').run(message.author.id)) {
    messageFail(message, `You are not authorized to use \`${config.prefix}${module.exports.help.name} ${subcmd}\``);
    return;
  }

  switch (subcmd) {
    // adds a serverentry
    case 'add':
      // check provided information
      if (!userIDOrWarnID || !reasonTesting) {
        messageFail(message,
          `Command usage: 
          \`\`\`${config.prefix}${module.exports.help.name} ${subcmd} ${userIDOrWarnID || 'USERID'} MESSAGE\`\`\``);
        return;
      }
      if (!await client.functions.get('FUNC_checkID').run(userIDOrWarnID, client, 'user')) {
        messageFail(message, `The user with the ID \`${userIDOrWarnID}\` doesn't exist.`);
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

    // edit a warning
    case 'edit':
      if (!serverID) {
        messageFail(message,
          `Command usage: 
          \`\`\`${config.prefix}${module.exports.help.name} ${subcmd} SERVERID\`\`\``);
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
        Is server part of Assisioation: \`${serverFound.active}\``;
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
        \`\`\`${config.prefix}${module.exports.help.name} ${module.exports.help.usage}\`\`\``);
      return;
  }
};

module.exports.help = {
  name: 'warn',
  usage: 'add|edit',
  desc: 'Warns other servers about a specific user.',
};
