const { MessageEmbed } = require('discord.js');

const toTime = require('pretty-ms');

const startupTime = +new Date();

const OfflineStat = require('../database/models/OfflineStat');

module.exports.run = async (client, config) => {
  if (!config.env.get('inDev')) {
    console.log(`[${module.exports.data.name}] Posting bot status message!`);
  } else return console.log(`[${module.exports.data.name}] Bot is in debugging-mode and will not post bot status message or update the DB entry.`);
  const embed = new MessageEmbed()
    .setTitle('Bot back online!')
    .setColor(4296754)
    .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL })
    .setTimestamp();
  const offlineTime = await OfflineStat.findOne({ where: { ID: 1 } }).catch(ERR);
  if (offlineTime) {
    embed
      .addField('The time the bot was offline:', `${toTime(startupTime - offlineTime.time * 1)}`, false)
      .addField('The bot went offline at:', new Date(offlineTime.time * 1), false);
  } else {
    embed.setDescription('The time that the bot was offline, is missing. A new entry got created!');
  }
  client.channels.cache.get(config.logStatusChannel).send({ embed });
};

module.exports.help = {
  name: 'SETUP_offlineStat',
};
