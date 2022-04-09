module.exports.run = async (config) => {
  if (!config.env.get('inDev')) {
    console.log(`[${module.exports.data.name}] Setting status...`);
  } else return console.log(`[${module.exports.data.name}] Bot is in debugging-mode and will post the bot status-message`);
  client.user.setStatus('online');
  client.user.setActivity(`with ${config.prefix.default}help`)
    .then(() => console.log(`[${module.exports.data.name}] Status set!`));
};

module.exports.help = {
  name: 'SETUP_status',
};
