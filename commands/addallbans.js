const { RichEmbed } = require('discord.js');

const Ban = require('../database/models/Ban');

const errHander = (err) => {
  console.error('ERROR:', err);
};

// TODO: use server ID instead (can be run remotely)
// TODO: ^ Update help

module.exports.run = async (client, message, args, config) => {
  if (message.author.id !== '172031697355800577') return message.react('❌');
  message.channel.send({ embed: new RichEmbed().setAuthor('Processing banlist...') })
    .then(async (msg) => {
      message.guild.fetchBans(true)
        .then((bans) => {
          bans.forEach(async ({ user, reason }) => {
          // TODO: make emojis disapear
            let regex = config.emojiLayout;
            let userTag = user.tag.replace(regex, 'X');
            let fixedReason = reason;
            if (reason !== null) fixedReason = reason.replace(new RegExp('\'', 'g'), '`');
            const [banEntry] = await Ban.findOrCreate({
              where: {
                userID: user.id,
                serverID: message.guild.id,
              },
              defaults: { reason: fixedReason, userTag },
            }).catch(errHander);
            if (!banEntry.isNewRecord) {
              Ban.update({ reason: fixedReason },
                { where: { userID: user.id, serverID: message.guild.id } })
                .catch(errHander);
            }
          });
        })
        .then(() => msg.edit({ embed: new RichEmbed().setAuthor('Done!', 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678134-sign-check-512.png') }))
        .catch(errHander);
    }).catch(errHander);
};

module.exports.help = {
  name: 'addallbans',
  desc: 'Adds all bans drom the current server its beeing used in.',
};
