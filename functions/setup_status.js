module.exports.run = async (client, config) => {
  if (!config.env.get('inDev')) {
    console.log(`[${module.exports.help.name}] Setting status...`);
  } else return console.log(`[${module.exports.help.name}] Bot is in debugging-mode and will post the bot status-message`);
  client.user.setStatus('online');
  // client.user.setActivity(`with ${config.prefix}help`)
  // .then(() => console.log(`[${module.exports.help.name}] Status set!`));
};

module.exports.help = {
  name: 'SETUP_status',
};
