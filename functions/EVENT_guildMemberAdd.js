const Ban = require('../database/models/Ban');

const ParticipatingServer = require('../database/models/ParticipatingServer');

const errHander = (err) => {
  console.error('ERROR:', err);
};

module.exports.run = async (member) => {

  // // getting newly added ban
  // guild.fetchBan(user)
  //   .then(async (ban) => {
  //     const userID = user.id;
  //     const userTag = user.tag;
  //     const serverID = guild.id;
  //     const reason = ban.reason;
  //     let fixedReason = reason;
  //     if (reason !== null) fixedReason = reason.replace(new RegExp('\'', 'g'), '`');
  //     const [banEntry] = await Ban.findOrCreate({
  //       where: { userID, serverID },
  //       defaults: { userTag, reason: fixedReason },
  //     }).catch(errHander);
  //     if (!banEntry.isNewRecord) {
  //       Ban.update({ reason: fixedReason, userTag },
  //         { where: { userTag, userID, serverID } })
  //         .catch(errHander);
  //     }
  //   });
};

module.exports.help = {
  name: 'EVENT_guildMemberAdd',
};
