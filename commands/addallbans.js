const { RichEmbed } = require('discord.js');

const Ban = require('../database/models/Ban');

module.exports.run = async (client, message, args, config) => {
  if (message.author.id !== '172031697355800577') return message.react('❌');
  message.channel.send({ embed: new RichEmbed().setAuthor('Processing banns...') })
    .then((msg) => {
      message.guild.fetchBans(true)
        .then(async (bans) => {
          bans.forEach(async ({ user, reason }) => {
            let fixedReason = reason;
            if (reason !== null) fixedReason = reason.replace(new RegExp('\'', 'g'), '`');
            Ban.find({ where: { userID: user.id } })
              .on('success', (ban) => {
                if (ban) {
                  Ban.update({
                    reason: fixedReason,
                  }).catch((err) => console.error(err));
                } else {
                  Ban.create({
                    userID: user.id,
                    serverID: message.guild.id,
                    userTag: user.tag,
                    reason: fixedReason,
                  }).catch((err) => console.error(err));
                }
              });
          });
        }).then(() => msg.edit({ embed: new RichEmbed().setAuthor('Done!', 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678134-sign-check-512.png') }));
    })
    .catch(() => console.error('Missing permissions!'));
};

module.exports.help = {
  name: 'addallbans',
};
