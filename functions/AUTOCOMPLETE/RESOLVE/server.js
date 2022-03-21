/*
This function provides a autocomplete for a full serverlist.
Discord doesn't provide a functionality for that.
*/

module.exports.run = async (searchInput) => {
  if (searchInput.length <= 2) return [];

  const guilds = client.guilds.cache;

  // id search
  if (!isNaN(searchInput)) {
    const found = guilds.find((guild) => guild.id === searchInput);
    if (found) return [{ name: found.name, value: found.id }];
    return [{ name: 'Unkown', value: searchInput }];
  }

  // text search
  const guildReply = await guilds
    .filter((guild) => guild.name.toLowerCase().search(searchInput.toLowerCase()) !== -1)
    .map((guild) => ({ name: guild.name, value: guild.id }));
  return guildReply.slice(0, 24);
};

module.exports.data = {
  name: 'server',
};
