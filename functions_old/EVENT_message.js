// checks if server is marked as blocked
async function checkServer(serverID) {
  const ParticipatingServer = require('../database/models/ParticipatingServer');
  const found = await ParticipatingServer.findOne({ where: { serverID, blocked: true } })
    .catch((err) => console.error(err));
  return found;
}

module.exports.run = async (client, message, config) => {
  client.functions.get('FUNC_userTagRecord').run(message.author.id, message.author.tag);
  // return if unwanted
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return messageFail(client, message, 'This bot is meant to be used in servers, sorry.');

  // checking if staffmember
  // DEPRECATED: use function with permissions instead
  if (message.member.roles.cache.find((role) => role.id === config.teamRole)) config.env.set('isTeam', true);

  // put comamnd in array
  const messageArray = message.content.split(/\s+/g);
  const command = messageArray[0];
  const args = messageArray.slice(1);

  // get prefix
  const prefix = await client.functions.get('FUNC_getPrefix').run(message);

  // return if not prefix
  if (!command.startsWith(prefix)) return;

  // check if server is on ParticipatingServers Table
  let serverID = null;
  if (message.channel.guild) serverID = message.channel.guild.id;
  const mainCMD = command.slice(prefix.length).toLowerCase();
  // commands to let through, when guild is blocked
  const infoCMDs = ['help', 'about', 'ping'];
  // check if blocked
  if (!infoCMDs.includes(mainCMD) && await checkServer(serverID)) {
    messageFail(client, message, 'It seems your server got blocked from the bot usage. If you want to know the reason and/or want to appeal, feel free to join the server linked in the help command.');
    return;
  }
  // commands to block, when guild has not been setup yet
  const mgmtCMDs = ['alias', 'ban', 'broadcast', 'eval', 'lookup', 'maintainer', 'warn', 'guildmgr'];
  // check if active and if its a management command
  if (mgmtCMDs.includes(mainCMD) && !await client.functions.get('FUNC_checkServer').run(serverID, false)) {
    messageFail(client, message, 'You need to setup the server first before yu can use this command.\nPlease run `/guild setup`.\n If you need help, please view the respective wiki article here (https://github.com/FlippedCode/agent-black/wiki/Adding-the-Bot) or join our support server');
    return;
  }

  // remove prefix and lowercase
  const cmd = client.commands.get(mainCMD);

  // run cmd if existent
  if (cmd) {
    cmd.run(client, message, args, config, prefix)
      .catch(console.log);
  }
};

module.exports.help = {
  name: 'EVENT_message',
};
