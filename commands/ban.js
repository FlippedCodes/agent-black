module.exports.run = async (interaction) => {
  // check BAN_MEMBERS permissions
  if (!interaction.memberPermissions.has('BAN_MEMBERS')) {
    messageFail(message, `You are not authorized to use \`${prefix}${module.exports.help.name}\``);
    return;
  }

  const command = interaction.options;
  // get user
  const userOpt = command.get('user', true);
  // check if member is bannable
  if (userOpt.member) {
    if (!userOpt.member.bannable) {
      messageFail(interaction, `The user  \`${userOpt.user.tag}\` can't be banned!\nHe owns the server, has higher permissions or is a system user!`);
      return;
    }
  }

  // value definitions
  const user = userOpt.user;
  const guild = interaction.guild;
  const userID = user.id;
  // check if user is already banned
  const banList = await guild.bans.fetch();
  const existingBan = await banList.find((ban) => ban.user.id === userID);
  // unbanning so reason gets updated
  if (existingBan) await guild.members.unban(userID);
  // get complete reason
  const reason = command.getString('reason', true);
  // check ban reason length for discord max ban reason
  if (reason.length > 512) {
    messageFail(interaction, 'Your ban reason is too long. Discord only allows a maximum length of 512 characters.');
    return;
  }
  // exec ban
  const processedBanUser = await guild.members.ban(userID, { reason });
  // write confirmation
  messageSuccess(interaction, `The user \`${processedBanUser.tag}\` has been banned!\nReason: \`\`\`${reason}\`\`\``);
};

module.exports.data = new CmdBuilder()
  .setName('ban')
  .setDescription('Bans a user.')
  .addUserOption((option) => option.setName('user').setDescription('Provide the user you wish to ban.').setRequired(true))
  .addStringOption((option) => option.setName('reason').setDescription('Reason for the server ban.').setRequired(true));
