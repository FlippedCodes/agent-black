const Ban = require('../database/models/Ban');

module.exports.run = async (guild, user) => {
  // getting newly added ban
  guild.fetchBan(user)
    .then(async (ban) => {
      // assign simpler values
      const userID = user.id;
      const userTag = user.tag;
      const serverID = guild.id;
      const userBanned = '1';
      const reason = ban.reason;
      // fix ban reason by filtering new line breaks
      let fixedReason = reason;
      if (reason !== null) fixedReason = reason.replace(new RegExp('\'', 'g'), '`');
      // create of find DB entry
      const [banEntry] = await Ban.findOrCreate({
        where: { userID, serverID },
        defaults: { userTag, reason: fixedReason, userBanned },
      }).catch(errHander);
      // check if entry is already on DB
      if (!banEntry.isNewRecord) {
        // update DB entry
        Ban.update({ reason: fixedReason, userTag, userBanned },
          { where: { userTag, userID, serverID } })
          .catch(errHander);
      }
      // TODO: check if user is on other servers as well and send notification
      // TODO: use functions
    });
};

module.exports.help = {
  name: 'EVENT_guildBanAdd',
};
