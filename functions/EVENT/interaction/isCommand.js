async function checkServerBlockStatus(serverID) {
  const ParticipatingServer = require('../../../database/models/ParticipatingServer');
  const found = await ParticipatingServer.findOne({ where: { serverID, blocked: true } }).catch(ERR);
  return found;
}

module.exports.run = async (interaction) => {
  const mainCMD = interaction.commandName.replace('_dev', '');
  // commands to let through, when guild is blocked
  const infoCMDs = ['about', 'ping'];
  // check if blocked
  if (!infoCMDs.includes(mainCMD) && await checkServerBlockStatus(interaction.guild.id)) {
    messageFail(interaction, 'It seems your server got blocked from the bot usage. If you want to know the reason and/or want to appeal, feel free to join the server linked in /about.');
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
