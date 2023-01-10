const { ActivityType } = require('discord.js');

module.exports.run = async () => {
  if (DEBUG) return;
  console.log(`[${module.exports.data.name}] Setting status...`);
  const servercount = await client.guilds.cache.size;
  await client.user.setActivity(`over ${servercount} servers!`, { type: ActivityType.Watching });
  console.log(`[${module.exports.data.name}] Status set!`);
};

module.exports.data = {
  name: 'status',
  callOn: 'setup',
};
