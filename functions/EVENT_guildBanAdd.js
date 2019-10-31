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
      Ban.findAll({ limit: 1, where: { userID, serverID } }).catch((err) => console.error(err))
        .then((ban) => {
          if (ban.length === 0) {
            Ban.create({
              userID, serverID, userTag, reason,
            }).catch((err) => console.error(err));
          } else {
            Ban.update({ reason },
              { where: { userID, serverID } })
              .catch((err) => console.error(err));
          }
        });
    });
};

module.exports.help = {
  name: 'EVENT_guildBanAdd',
};
