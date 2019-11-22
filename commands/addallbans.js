const { RichEmbed } = require('discord.js');

const Ban = require('../database/models/Ban');

const errHander = (err) => {
  console.error('ERROR:', err);
};

// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
  return `Command usage: 
    \`\`\`${prefix}${cmdName} ${subcmd}\`\`\``;
}

// creates a embed messagetemplate for failed actions
function messageFail(client, message, body) {
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false);
}

// TODO: use server ID instead (can be run remotely)
// TODO: ^ Update help

module.exports.run = async (client, message, args, config) => {
  const [serverID] = args;

  if (!await client.functions.get('FUNC_checkUser').run(message.author.id)) {
    messageFail(client, message, `You are not authorized to use \`${config.prefix}${module.exports.help.name}\``);
    return;
  }
  if (!serverID) {
    const info = module.exports.help;
    messageFail(client, message, CommandUsage(config.prefix, info.name, info.usage));
    return;
  }
  if (!await client.functions.get('FUNC_checkID').run(serverID, client, 'server')) {
    messageFail(client, message, `The server with the ID \`${serverID}\` doesn't exist or the bot hasn't been added to the server yet.`);
    return;
  }

  message.channel.send({ embed: new RichEmbed().setAuthor('Processing banlist...') })
    .then(async (msg) => {
      client.guilds.find((server) => server.id === serverID).fetchBans(true)
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
  usage: 'SERVERID',
  desc: 'Adds all bans drom the current server its beeing used in.',
};
