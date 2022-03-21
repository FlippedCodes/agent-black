const { MessageEmbed } = require('discord.js');

const toTime = require('pretty-ms');

const startupTime = +new Date();

const OfflineStat = require('../../database/models/OfflineStat');

module.exports.run = async () => {
  if (DEBUG) return;
  console.log(`[${module.exports.data.name}] Posting bot status message!`);
  const embed = new MessageEmbed()
    .setTitle('AgentBlack - Command Instance - Bot back online!')
    .setColor(4296754)
    .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL })
    .setTimestamp();
  const offlineTime = await OfflineStat.findOne({ where: { ID: 1 } }).catch(ERR);
  if (offlineTime) {
    embed
      .addField('The time the bot went offline:', `${toTime(startupTime - offlineTime.time * 1)}`, false)
      .addField('The bot went offline at:', `${new Date(offlineTime.time * 1)}`, false);
  } else {
    embed.setDescription('The time that the bot was offline, is missing. A new entry got created!');
  }
  client.channels.cache.get(config.logChannel).send({ embeds: [embed] });

  setInterval(async () => {
    // loop db update in 5 sec intervall
    const [offlineStat] = await OfflineStat.findOrCreate({
      where: { ID: 2 }, defaults: { time: startupTime },
    }).catch(ERR);
    if (!offlineStat.isNewRecord) {
      OfflineStat.update({ time: +new Date() }, { where: { ID: 2 } }).catch(ERR);
    }
  }, 1 * 5000);
};

module.exports.data = {
  name: 'offlineStat',
  callOn: 'setup',
};
