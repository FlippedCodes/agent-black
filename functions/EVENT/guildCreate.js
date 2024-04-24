const { MessageEmbed } = require('discord.js');

const Ban = require('../../database/models/Ban');

const ParticipatingServer = require('../../database/models/ParticipatingServer');

// checks if server is participating server
function getServerEntry(serverID) {
  return client.functions.get('GET_DB_registered').run(serverID, true);
}

async function addServerEntry(serverID, serverName) {
  await ParticipatingServer.findOrCreate({ where: { serverID, serverName } }).catch(ERR);
}

module.exports.run = async (guild) => {
  // debug protection
  if (DEBUG) return;
  const serverID = guild.id;
  // check if was alreads added: add a server entry in the DB
  const foundServer = await getServerEntry(serverID);
  if (!foundServer) await addServerEntry(serverID, guild.name);
  else if (foundServer.blocked) return;
  // check if server is blacklisted before continuing
  // message owner about adding the bot and how to procceed
  const owner = await guild.members.fetch(guild.ownerId);
  const embed = new MessageEmbed()
    .setTitle('Hello World!')
    .setFooter({ text: 'Only you received this message.' })
    .setDescription(`Thanks for adding me to your delightful server.
Before you expect anything from me, I need you to complete some more steps before I get completely functional.

In order to use me properly, you need to run the following commands in your server:
\`/guild setup\`
Then I will ask you for a log channel, where I am allowed to send messages, and a staff/team role that are authorized to use some of the commands.
After you run the command you need to confirm the Terms of Service and you are good to go!

If you added our bot before already: Keep in mind, that you need to run \`/guild enable\` to use the old configuration.

As the last step, it's recommended joining our Discord server for frequent updates or if there are questions about a ban.
We also gladly help you out, if you need any assistance with the bot. https://discord.gg/TqBwHtzzhD`);
  owner.send({ embeds: [embed] });
  // add all bans to DB
  const allBans = await guild.bans.fetch();
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
    }).catch(ERR);
    if (!banEntry.isNewRecord) {
      Ban.update({ reason: fixedReason, userBanned }, { where: { userID, serverID } }).catch(ERR);
    }
  });
};

module.exports.data = {
  name: 'guildCreate',
};
