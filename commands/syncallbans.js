const { MessageEmbed } = require('discord.js');

const Ban = require('../database/models/Ban');

const errHandler = (err) => {
  console.error('ERROR:', err);
};

// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
  return `Command usage: 
    \`\`\`${prefix}${cmdName} ${subcmd}\`\`\``;
}

module.exports.run = async (client, message, args, config, prefix) => {
  // check owner permissions
  if (message.author.id !== '172031697355800577') return message.react('❌');

  message.channel.send({ embed: new MessageEmbed().setAuthor('Processing banlist for all servers...') })
    .then(async (msg) => {
      client.guilds.cache.forEach((guild) => {
        guild.fetchBans(true)
          .then((bans) => {
            bans.forEach(async ({ user, reason }) => {
              const userTag = user.tag;
              const userBanned = true;
              const userID = user.id;
              const serverID = guild.id;
              let fixedReason = reason;
              if (reason !== null) fixedReason = reason.replace(new RegExp('\'', 'g'), '`');
              const [banEntry] = await Ban.findOrCreate({
                where: { userID, serverID },
                defaults: { reason: fixedReason, userTag, userBanned },
              }).catch(errHandler);
              if (!banEntry.isNewRecord) {
                Ban.update({ reason: fixedReason, userBanned },
                  { where: { userID, serverID } })
                  .catch(errHandler);
              }
            });
          })
          .then(() => msg.edit({ embed: new MessageEmbed().setAuthor('Done!', 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678134-sign-check-512.png') }))
          .catch(errHandler);
      });
    }).catch(errHandler);
};

module.exports.help = {
  name: 'syncallbans',
  desc: 'Adds all bans from all participating servers. [OWNER ONLY]',
};
