async function checkServerBlockStatus(serverID) {
  const ParticipatingServer = require('../../../database/models/ParticipatingServer');
  const found = await ParticipatingServer.findOne({ where: { serverID, blocked: true } }).catch(ERR);
  return found;
}

module.exports.run = async (interaction) => {
  // debug protection
  if (!DEBUG && interaction.commandName.includes('_dev')) return;
  if (DEBUG && !interaction.commandName.includes('_dev')) return;

  const mainCMD = interaction.commandName.replace('_dev', '');
  // commands to let through, when guild is blocked
  const infoCMDs = ['about', 'ping'];
  // check if blocked
  if (!infoCMDs.includes(mainCMD) && await checkServerBlockStatus(interaction.guild.id)) {
    messageFail(interaction, 'It seems your server got blocked from the bot usage. If you want to know the reason and/or want to appeal, feel free to join the server linked in /about.');
    return;
  }
  // commands to block, when guild has not been setup yet
  const mgmtCMDs = ['alias', 'ban', 'broadcast', 'eval', 'lookup', 'maintainer', 'warn'];
  // check if active and if its a management command
  if (mgmtCMDs.includes(mainCMD) && !await client.functions.get('GET_DB_server').run(interaction.guild.id, false)) {
    messageFail(interaction,
      `You need to setup the server first before you can use this command.
      Please run \`/guild setup\`.
      If you need help, please view the respective wiki article here (https://github.com/FlippedCode/agent-black/wiki/Adding-the-Bot)
      or join our support server (https://discord.gg/TqBwHtzzhD).`);
    return;
  }

  const command = client.commands.get(DEBUG ? mainCMD : interaction.commandName);
  if (command) {
    // if debuging trigger application thinking
    // TEMP: set to false to test some public commands
    if (DEBUG) await interaction.deferReply({ ephemeral: false });
    command.run(interaction).catch(ERR);
    return;
  }
};

module.exports.data = {
  name: 'isCommand',
};
