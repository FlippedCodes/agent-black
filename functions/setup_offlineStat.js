const { RichEmbed } = require('discord.js');

const toTime = require('pretty-ms');

const startupTime = +new Date();

module.exports.run = async (client, config, DB, fs) => {
  if (config.env.get('inDev')) return console.log('Bot is in testing and will not post offline Stat.');
  DB.query('SELECT * FROM setup_offlineStat WHERE entry = \'1\'', async (err, rows) => {
    if (err) throw err;
    let embed = new RichEmbed()
      .setTitle('Bot back online!')
      .setColor(4296754)
      .addField('The time the bot was offline:', `${toTime(startupTime - rows[0].time * 1)}`, false)
      .addField('The bot went offline at:', new Date(rows[0].time * 1), false)
      .setFooter(client.user.tag, client.user.displayAvatarURL)
      .setTimestamp();
    client.channels.get(config.logStatusChannel).send({ embed });
  });

  // create new entry db entry
  DB.query(`UPDATE setup_offlineStat SET time = '${startupTime}' WHERE entry = '1'`);

  setInterval(() => {
    // loop db update in 5 sec intervall
    DB.query('SELECT * FROM setup_offlineStat WHERE entry = \'1\'', async (err, rows) => {
      if (err) throw err;
      if (rows[0]) {
        const carc = rows[0].time * 1 + 5000;
        DB.query(`UPDATE setup_offlineStat SET time = '${carc}' WHERE entry = '1'`);
      } else {
        console.log('Something went wrong while sending statupdate: It wasn\'t found!');
      }
    });
  }, 1 * 5000);
};

module.exports.help = {
  name: 'SETUP_offlineStat',
};
