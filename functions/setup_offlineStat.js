const toTime = require('pretty-ms');

const startupTime = +new Date();

module.exports.run = async (client, config, DB, fs) => {
  if (config.env.get('inDev')) return console.log(`[${config.name}] Bot is in testing and will not post offline Stat.`);
  DB.query('SELECT * FROM setup_offlineStat WHERE entry = \'1\'', async (err, rows) => {
    if (err) throw err;
    const embed = {
      title: 'Bot back online!',
      fields: [{
        name: 'The time the bot was offline:',
        value: `${toTime(startupTime - rows[0].time * 1)}`,
      },
      {
        name: 'The bot went offline at:',
        value: new Date(rows[0].time * 1),
      },
      ],
      color: 4296754,
      timestamp: new Date(),
      footer: {
        icon_url: client.user.displayAvatarURL,
        text: client.user.tag,
      },
    };
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
  name: 'setup_offlineStat',
};
