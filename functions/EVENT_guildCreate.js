const { MessageEmbed } = require('discord.js');

const Ban = require('../database/models/Ban');

const ParticipatingServer = require('../database/models/ParticipatingServer');

const config = require('../config/main.json');

const errHandler = (err) => {
  console.error('ERROR:', err);
};

// checks if server is participating server
function getServerEntry(client, serverID) {
  return client.functions.get('FUNC_checkServer').run(serverID, true);
}

async function addServerEntry(serverID, serverName) {
  await ParticipatingServer.findOrCreate({ where: { serverID, serverName } }).catch(errHandler);
}

module.exports.run = async (client, guild) => {
  const serverID = guild.id;
  // check if was alreads added: add a server entry in the DB
  if (!await getServerEntry(client, serverID)) await addServerEntry(serverID, guild.name);
  // message owner about adding the bot and how to procceed
  const owner = await guild.fetchOwner();
  const embed = new MessageEmbed()
    .setTitle('Hello World!')
    .setFooter('Only you received the message.')
    .setDescription(`Thanks for adding me to your delightful server.
Before you expect anything from me, I need you to complete some more steps before I get completely functional.

Please tell me, where to log new members and what server role belongs to the team/staff. When you got the information, fill it into the command below and run it in any channel.
\`a!guild setup [logChannelID] [teamRoleID]\`
Example: \`a!guild setup 123456789123456 987654321987654\`
After you run the command you need to confirm the Terms of Service and you are good to go!

If you added our bot before already: Keep in mind, that you need to run \`a!guild enable\`.

Feel free to join our Discord server, and we gladly help you out, if you need any assistance. https://discord.gg/QhfnAWgEMS`);
  owner.send(embed);
  // add all bans to DB
  const allBans = await guild.fetchBans(true);
  allBans.forEach(async ({ user, reason }) => {
    const regex = config.emojiLayout;
    const userTag = user.tag.replace(regex, 'X');
    const userBanned = true;
    const userID = user.id;
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
};

module.exports.help = {
  name: 'EVENT_guildCreate',
};
