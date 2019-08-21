module.exports.run = async (client, fs) => {
  client.user.setStatus('online');
  client.user.setActivity('with K!help');
};

module.exports.help = {
  name: 'DBcache',
};
