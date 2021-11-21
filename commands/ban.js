module.exports.run = async (interaction) => {
  // check BAN_MEMBERS permissions
  if (!interaction.memberPermissions.has('BAN_MEMBERS')) {
    messageFail(message, `You are not authorized to use \`${prefix}${module.exports.help.name}\``);
    return;
  }

  const command = interaction.options;
  // get member
  const toBanMember = command.getMember('user', true);
  // TODO: might need a error handler, if member is not on the server
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
  const reason = command.getUser('reason', true);
  // check ban reason length for discord max ban reason
  if (reason.length > 512) {
    messageFail(message, 'Your ban reason is too long. Discord only allows a maximum length of 512 characters.');
    return;
  }
  // exec ban
  const processedBanUser = await message.guild.members.ban(userID, { reason });
  // write confirmation
  messageSuccess(message, `The user \`${processedBanUser.tag}\` has been banned!\nReason: \`\`\`${reason}\`\`\``);
};

module.exports.data = new CmdBuilder()
  .setName('ban')
  .setDescription('Bans a user.')
  .addUserOption((option) => option.setName('user').setDescription('Provide the user you wish to ban.').setRequired(true))
  .addStringOption((option) => option.setName('reason').setDescription('Reason for the server ban.').setRequired(true));
