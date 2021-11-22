const Ban = require('../database/models/Ban');

module.exports.run = async (interaction) => {
  // check owner permissions
  if (interaction.user.id !== '172031697355800577') return messageFail(interaction, `You are not authorized to use \`${module.exports.data.name}\``);

  await messageSuccess(interaction, 'Processing banlist for all servers...');
  await client.guilds.cache.forEach(async (guild) => {
    const bans = await guild.bans.fetch({ cache: false });
    await bans.forEach(async ({ user, reason }) => {
      const userTag = user.tag;
      const userBanned = true;
      const userID = user.id;
      const serverID = guild.id;
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
  });
  await setTimeout(() => {
    messageSuccess(interaction, 'Done!');
  }, client.guilds.cache.size * 300);
};

module.exports.data = new CmdBuilder()
  .setName('syncallbans')
  .setDescription('Adds all bans from all participating servers. [OWNER ONLY].');
