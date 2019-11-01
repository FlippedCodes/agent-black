const Ban = require('../database/models/Ban');

module.exports.run = async (client, guild, user, config) => {
  // getting infomration needed
  // getting newly added ban
  guild.fetchBan(user)
    .then(async (ban) => {
      const userID = user.id;
      const userTag = user.tag;
      const serverID = guild.id;
      const reason = ban.reason;
      let fixedReason = reason;
      if (reason !== null) fixedReason = reason.replace(new RegExp('\'', 'g'), '`');
      const [banEntry] = await Ban.findOrCreate({
        where: { userID, serverID },
        defaults: { reason: fixedReason },
      }).catch(errHander);
      if (!banEntry.isNewRecord) {
        Ban.update({ reason: fixedReason, userTag },
          { where: { userID, serverID } })
          .catch(errHander);
      }
    });
};

module.exports.help = {
  name: 'EVENT_guildBanAdd',
};
