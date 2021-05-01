module.exports.run = async (client, message, config) => {
  client.functions.get('FUNC_userTagRecord').run(message.author.id, message.author.tag);
  // return if unwanted
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;

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
  // commands to block, when guild has not been setup yet
  const mgmtCMDs = ['alias', 'ban', 'broadcast', 'eval', 'lookup', 'maintainer', 'warn', 'guildmgr'];
  if (mgmtCMDs.includes(mainCMD) && !await client.functions.get('FUNC_checkServer').run(serverID, false)) {
    messageFail(message, `You need to setup the server first before yu can use this command.\nPlease run \`${prefix}guild setup\`.`);
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
