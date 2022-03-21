/*
This function provides a autocomplete for channels in another server.
This is needed, as discords built in search only searches the server where the command is executed in
*/

module.exports.run = async (searchInput, guildId) => {
  // if (searchInput.length <= 2) return [];

  const guild = client.guilds.cache.find((guild) => guild.id === guildId);
  if (!guild) return [{ name: 'Define server first.', value: '0' }];

  const channels = guild.channels.cache
    .filter((channel) => channel.type === 'GUILD_TEXT');

  // id search
  if (searchInput !== '' && !isNaN(searchInput)) {
    const found = channels.find((channel) => channel.id === searchInput);
    if (found) return [{ name: found.name, value: found.id }];
    return [{ name: 'Unkown', value: searchInput }];
  }

  // text search
  const channelReply = await channels
    .filter((channel) => channel.name.toLowerCase().search(searchInput.toLowerCase()) !== -1)
    .map((channel) => ({ name: channel.name, value: channel.id }));
  return channelReply.slice(0, 24);
};

module.exports.data = {
  name: 'server',
};
