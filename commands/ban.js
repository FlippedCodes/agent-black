// creates a embed messagetemplate for succeded actions
function messageSuccess(client, message, body) {
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 4296754, false);
}

// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
  return `Command usage: 
    \`\`\`${prefix}${cmdName} ${subcmd}\`\`\``;
}

// creates a embed messagetemplate for failed actions
function messageFail(client, message, body) {
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete({ timeout: 10000 }));
}

module.exports.run = async (client, message, args, config) => {
  // check permissions
  if (!await client.functions.get('FUNC_checkPermissions').run(message.member, message, 'BAN_MEMBERS')) {
    messageFail(client, message, `You are not authorized to use \`${config.prefix}${module.exports.help.name}\``);
    return;
  }
  // get args
  const [userID, reasonTester] = args;
  // check if gived arge are correct
  if (!userID) {
    messageFail(client, message, CommandUsage(config.prefix, module.exports.help.name, 'USERID REASON'));
    return;
  }
  if (isNaN(userID)) {
    messageFail(client, message, CommandUsage(config.prefix, module.exports.help.name, 'USERID REASON'));
    return;
  }
  if (!reasonTester) {
    messageFail(client, message, CommandUsage(config.prefix, module.exports.help.name, `${userID} REASON`));
    return;
  }
  // check userID if valid
  if (!await client.functions.get('FUNC_checkID').run(userID, client, 'user')) {
    messageFail(client, message, `A user with the ID \`${userID}\` doesn't exist!`);
    return;
  }
  // get member
  const toBanMember = await message.guild.members.cache.get(userID);
  // check if member is bannable
  if (toBanMember) {
    if (!toBanMember.bannable) {
      messageFail(client, message, `The user  \`${toBanMember.user.tag}\` can't be banned!\nHe owns the server, has higher permissions or is a system user!`);
      return;
    }
  }
  // check if user is already banned
  // FIXME: existingBan is always empty
  // const banList = await message.guild.fetchBans();
  // const existingBan = banList.find((user) => user.id === userID);
  // if (existingBan) {
  //   messageFail(client, message, `The user \`${toBanUser.tag}\` has been already banned!`);
  //   return;
  // }
  // get complete reason
  const slicedReason = await args.join(' ').slice(userID.length + 1);
  // exec ban
  const processedBanUser = await message.guild.members.ban(userID, { reason: slicedReason });
  // write confirmation
  messageSuccess(client, message, `The user \`${processedBanUser.tag}\` has been banned!\nReason: \`${slicedReason}\``);
};

module.exports.help = {
  name: 'ban',
  usage: 'USERID REASON',
  desc: 'Bans a user by ID',
};
