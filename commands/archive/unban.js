// TODO: not yet completed beforehand

// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
  return `Command usage: 
    \`\`\`/${cmdName} ${subcmd}\`\`\``;
}

module.exports.run = async (interaction) => {
  // check permissions
  if (!await client.functions.get('FUNC_checkPermissionsChannel').run(message.member, message, 'BAN_MEMBERS')) {
    messageFail(message, `You are not authorized to use \`/${module.exports.data.name}\``);
    return;
  }
  // get args
  const [userID, reasonTester] = args;

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
  name: 'unban',
  usage: 'USERID REASON',
  desc: '',
};

module.exports.data = new CmdBuilder()
  .setName('unban')
  .setDescription('Pardons a user by ID.')
  .addUserOption((option) => option.setName('user').setDescription('Provide the user you wish to ban.').setRequired(true))
  .addStringOption((option) => option.setName('reason').setDescription('Reason for the server ban.').setRequired(true));
