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
      // TODO: check in fan is already is on list and update
      await Ban.create({
        userID, serverID, userTag, reason,
      }).catch((err) => console.error(err));
    });
};

module.exports.help = {
  name: 'EVENT_guildBanAdd',
};
