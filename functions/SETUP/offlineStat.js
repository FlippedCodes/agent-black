const { EmbedBuilder } = require('discord.js');

const moment = require('moment');

const startupTime = +new Date();

const OfflineStat = require('../../database/models/OfflineStat');

module.exports.run = async () => {
  // if (DEBUG) return;
  console.log(`[${module.exports.data.name}] Posting bot status message!`);
  const embed = new EmbedBuilder()
    .setTitle('AgentBlack - Bot back online!')
    .setColor('Green')
    .setFooter({ text: client.user.tag, icon_url: client.user.displayAvatarURL })
    .setTimestamp();
  const offlineTime = await OfflineStat.findOne({ where: { ID: 1 } }).catch(ERR);
  if (offlineTime) {
    const timeStamp = moment(offlineTime.updatedAt);
    embed.addFields([
      { name: 'Heartbeat stopped at', value: `<t:${timeStamp.format('X')}:f>` },
      { name: 'Time the bot was away', value: `${moment().diff(timeStamp, 'seconds', true)}s` },
    ]);
  } else {
    embed.setDescription('The time that the bot was offline, is missing. A new entry got created!');
  }
  client.channels.cache.get(config.logChannel).send({ embeds: [embed] });

  setInterval(async () => {
    // loop db update in 5 sec intervall
    const [offlineStat] = await OfflineStat.findOrCreate({
      where: { ID: 1 }, defaults: { time: startupTime },
    }).catch(ERR);
    if (!offlineStat.isNewRecord) {
      OfflineStat.update({ time: +new Date() }, { where: { ID: 1 } }).catch(ERR);
    }
  }, 1 * 5000);
};

module.exports.data = {
  name: 'offlineStat',
  callOn: 'setup',
};
