// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
  return `Command usage: 
    \`\`\`${prefix}${cmdName} ${subcmd}\`\`\``;
}

module.exports.run = async (client, message, args, config, prefix) => {
  // check permissions
  if (!await client.functions.get('FUNC_checkPermissions').run(message.member, message, 'BAN_MEMBERS')) {
    messageFail(message, `You are not authorized to use \`${prefix}${module.exports.help.name}\``);
    return;
  }
  // get args
  const [userID, reasonTester] = args;
  // check if gived arge are correct
  if (!userID) {
    messageFail(message, CommandUsage(prefix, module.exports.help.name, 'USERID REASON'));
    return;
  }
  if (isNaN(userID)) {
    messageFail(message, CommandUsage(prefix, module.exports.help.name, 'USERID REASON'));
    return;
  }
  if (!reasonTester) {
    messageFail(message, CommandUsage(prefix, module.exports.help.name, `${userID} REASON`));
    return;
  }
  // check userID if valid
  if (!await client.functions.get('FUNC_checkID').run(userID, client, 'user')) {
    messageFail(message, `A user with the ID \`${userID}\` doesn't exist!`);
    return;
  }
  // get member
  const toBanMember = await message.guild.members.cache.get(userID);
  // check if member is bannable
  if (toBanMember) {
    if (!toBanMember.bannable) {
      messageFail(message, `The user  \`${toBanMember.user.tag}\` can't be banned!\nHe owns the server, has higher permissions or is a system user!`);
      return;
    }
  }
  // check if user is already banned
  const banList = await message.guild.fetchBans();
  const existingBan = await banList.find((ban) => ban.user.id === userID);
  if (existingBan) {
    // unbanning so reason gets updated
    await message.guild.members.unban(userID);
    // messageFail(message, `The user \`${toBanUser.tag}\` has been already banned!`);
    // return;
  }
  // get complete reason
  const slicedReason = await args.join(' ').slice(userID.length + 1);
  // check ban reason length for discord max ban reason
  if (slicedReason.length > 512) {
    messageFail(message, 'Your ban reason is too long. Discord only allows a maximum length of 512 characters.');
    return;
  }
  // exec ban
  const processedBanUser = await message.guild.members.ban(userID, { reason: slicedReason });
  // write confirmation
  messageSuccess(message, `The user \`${processedBanUser.tag}\` has been banned!\nReason: \`${slicedReason}\``);
};

module.exports.help = {
  name: 'ban',
  usage: 'USERID REASON',
  desc: 'Bans a user by ID',
};
