const Ban = require('../database/models/Ban');

module.exports.run = async (guild, user) => {
  // getting newly added ban
  guild.fetchBan(user)
    .then(async (ban) => {
      const userID = user.id;
      const userTag = user.tag;
      const serverID = guild.id;
      const userBanned = true;
      const reason = ban.reason;
      let fixedReason = reason;
      if (reason !== null) fixedReason = reason.replace(new RegExp('\'', 'g'), '`');
      const [banEntry] = await Ban.findOrCreate({
        where: { userID, serverID },
        defaults: { userTag, reason: fixedReason, userBanned },
      }).catch(errHander);
      if (!banEntry.isNewRecord) {
        Ban.update({ reason: fixedReason, userTag, userBanned },
          { where: { userTag, userID, serverID } })
          .catch(errHander);
      }
    });
};

module.exports.help = {
  name: 'EVENT_guildBanAdd',
};
