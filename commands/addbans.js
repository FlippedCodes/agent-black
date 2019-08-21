const { RichEmbed } = require('discord.js');

module.exports.run = async (client, message, args, DB, config) => {
  if (message.author.id !== '172031697355800577') return message.react('❌');
  message.channel.send({ embed: new RichEmbed().setAuthor('Processing banns') })
    .then((msg) => {
      message.guild.fetchBans(true)
        .then(async (bans) => {
          bans.forEach(({ user, reason }) => {
            DB.query(`SELECT * FROM bannedUsers WHERE userID = '${user.id}' AND serverID = '${message.guild.id}'`, (err, rows) => {
              if (err) throw err;
              if (rows[0]) {
                DB.query(`UPDATE bannedUsers SET reason = '${reason}' WHERE userID = '${user.id}' AND serverID = '${message.guild.id}'`);
              } else {
                DB.query(`INSERT INTO bannedUsers (userID, serverID, reason, time) VALUES ('${user.id}', '${message.guild.id}', '${reason}', '')`);
              }
            });
          });
        }).then(() => msg.edit({ embed: new RichEmbed().setAuthor('Done!', 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678134-sign-check-512.png') }));
    })
    .catch(() => console.error(`[${config.name}] Missing permissions!`));
};

module.exports.help = {
  name: 'addbans',
};
