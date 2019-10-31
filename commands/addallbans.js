const { RichEmbed } = require('discord.js');

const Ban = require('../database/models/Ban');

const errHander = (err) => {
  console.error('ERROR:', err);
};

module.exports.run = async (client, message, args, config) => {
  if (message.author.id !== '172031697355800577') return message.react('❌');
  message.channel.send({ embed: new RichEmbed().setAuthor('Processing banns...') })
    .then((msg) => {
      message.guild.fetchBans(true)
        .then(async (bans) => {
          bans.forEach(async ({ user, reason }) => {
            // TODO: make emojis disapear
            let regex = config.emojiLayout;
            let userTag = user.tag.replace(regex, 'X');
            let fixedReason = reason;
            if (reason !== null) fixedReason = reason.replace(new RegExp('\'', 'g'), '`');
            Ban.findAll({ limit: 1, where: { userID: user.id, serverID: message.guild.id } }).catch(errHander)
              .then((ban) => {
                if (ban.length === 0) {
                  Ban.create({
                    userID: user.id,
                    serverID: message.guild.id,
                    userTag,
                    reason: fixedReason,
                  }).catch(errHander);
                } else {
                  Ban.update({ reason: fixedReason },
                    { where: { userID: user.id, serverID: message.guild.id } })
                    .catch(errHander);
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
