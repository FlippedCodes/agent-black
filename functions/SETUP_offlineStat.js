const { RichEmbed } = require('discord.js');

const toTime = require('pretty-ms');

const startupTime = +new Date();

const OfflineStat = require('../database/models/OfflineStat');

const errHander = (err) => {
  console.error('ERROR:', err);
};

module.exports.run = async (client, config) => {
  if (!config.env.get('inDev')) {
    console.log(`[${module.exports.help.name}] Posting bot status message!`);
  } else return console.log(`[${module.exports.help.name}] Bot is in debugging-mode and will not post bot status message or update the DB entry.`);
  let embed = new RichEmbed()
    .setTitle('Bot back online!')
    .setColor(4296754)
    .setFooter(client.user.tag, client.user.displayAvatarURL)
    .setTimestamp();
  const offlineTime = await OfflineStat.findOne({ where: { ID: 1 } }).catch(errHander);
  if (offlineTime) {
    embed
      .addField('The time the bot was offline:', `${toTime(startupTime - offlineTime.time * 1)}`, false)
      .addField('The bot went offline at:', new Date(offlineTime.time * 1), false);
  } else {
    embed.setDescription('The time that the bot was offline, is missing. A new entry got created!');
  }
  client.channels.get(config.logStatusChannel).send({ embed });

  setInterval(async () => {
    // loop db update in 5 sec intervall
    const [offlineStat] = await OfflineStat.findOrCreate({
      where: { ID: 1 }, defaults: { time: startupTime },
    }).catch(errHander);
    if (!offlineStat.isNewRecord) {
      OfflineStat.update({ time: +new Date() }, { where: { ID: 1 } }).catch(errHander);
    }
  }, 1 * 5000);
};

module.exports.help = {
  name: 'SETUP_offlineStat',
};
