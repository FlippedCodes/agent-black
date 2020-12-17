// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
  return `Command usage: 
    \`\`\`${prefix}${cmdName} ${subcmd}\`\`\``;
}

// is used to configure settings
// if setting is not set, use default from config
module.exports.run = async (client, message, args, config) => {
  // TODO: check permissions (Servermanager)
  // check DM
  if (message.channel.type === 'dm') return messageFail(message, 'This comamnd is for servers only.');
  // check if user is teammember
  if (!message.member.roles.cache.find(({ id }) => id === config.teamRole)) return messageFail(message, 'You don\'t have access to this command!');
  const [subcmd] = args;
  const commandValues = ['enable', 'forceReason', 'pointLifetime', 'listReasons', 'addReason', 'removeReason', 'listPunishment', 'addPunishment', 'removePunishment'];
  const currentCMD = module.exports.help;
  if (commandValues.includes(subcmd)) {
    client.functions.get(`CMD_${currentCMD.name}_${subcmd}`)
      .run(client, message, args, config);
  } else {
    messageFail(message, CommandUsage(config.prefix, currentCMD.name, commandValues.join('|')));
  }
};

module.exports.help = {
  name: 'punishsettings',
  desc: 'Managing command for setting up pointslists.',
};