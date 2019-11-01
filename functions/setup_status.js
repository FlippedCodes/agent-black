module.exports.run = async (client, config) => {
  console.log(`[${module.exports.help.name}] Setting status...`);
  client.user.setStatus('online');
  client.user.setActivity(`with ${config.prefix}help`)
    .then(() => console.log(`[${module.exports.help.name}] Status set!`));
};

module.exports.help = {
  name: 'SETUP_status',
};
