module.exports.run = async (guildMember, message, type) => {
  if (message.channel.type === 'dm') return false;
  const botperms = guildMember.permissionsIn(message.channel);
  const hasPermissions = botperms.has(type);
  return hasPermissions;
};

module.exports.help = {
  name: 'FUNC_checkPermissions',
};
