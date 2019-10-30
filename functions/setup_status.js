module.exports.run = async (client, config) => {
  client.user.setStatus('online');
  client.user.setActivity(`with ${config.prefix}help`)
    .then(() => console.log('Set status!'));
};

module.exports.help = {
  name: 'SETUP_status',
};
