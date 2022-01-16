const { MessageEmbed } = require('discord.js');

const Ban = require('../database/models/Ban');

const ERR = (err) => {
  console.error('ERROR:', err);
};

// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
  return `Command usage: 
    \`\`\`${prefix}${cmdName} ${subcmd}\`\`\``;
}

module.exports.run = async (client, message, args, config, prefix) => {
  // check maintainer permissions
  if (!await client.functions.get('FUNC_checkPermissionsDB').run(message.author.id)) {
    messageFail(message, `You are not authorized to use \`${prefix}${module.exports.help.name}\``);
    return;
  }

  const [serverID] = args;
  if (!serverID) {
    const info = module.exports.help;
    messageFail(message, CommandUsage(prefix, info.name, info.usage));
    return;
  }
  if (!await client.functions.get('FUNC_checkID').run(serverID, client, 'server')) {
    messageFail(message, `The server with the ID \`${serverID}\` doesn't exist or the bot hasn't been added to the server yet.`);
    return;
  }

  message.channel.send({ embed: new MessageEmbed().setAuthor({ name: 'Processing banlist...' }) })
    .then(async (msg) => {
      client.guilds.cache.find((server) => server.id === serverID).fetchBans(true)
        .then((bans) => {
          bans.forEach(async ({ user, reason }) => {
            const regex = config.emojiLayout;
            const userTag = user.tag.replace(regex, 'X');
            const userBanned = true;
            const userID = user.id;
            let fixedReason = reason;
            if (reason !== null) fixedReason = reason.replace(new RegExp('\'', 'g'), '`');
            const [banEntry] = await Ban.findOrCreate({
              where: { userID, serverID },
              defaults: { reason: fixedReason, userTag, userBanned },
            }).catch(ERR);
            if (!banEntry.isNewRecord) {
              Ban.update({ reason: fixedReason, userBanned },
                { where: { userID, serverID } })
                .catch(ERR);
            }
          });
        })
        .then(() => msg.edit({ embed: new MessageEmbed().setAuthor({ name: 'Done!', iconURL: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678134-sign-check-512.png' }) }))
        .catch(ERR);
    }).catch(ERR);
};

module.exports.help = {
  name: 'syncbans',
  usage: 'SERVERID',
  desc: 'Adds all bans from the current server its beeing used in. [MAINTAINER ONLY]',
};
