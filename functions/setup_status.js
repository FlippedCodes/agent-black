module.exports.run = async (client, fs, config) => {
  client.user.setStatus('online');
  client.user.setActivity(`with ${config.prefix}help`);
};

module.exports.help = {
  name: 'setup_status',
};
