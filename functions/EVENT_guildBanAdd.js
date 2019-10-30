// module.exports.run = async (client, guild, user, DB, config) => {
module.exports.run = async (client, guild, user, config) => {
  // getting infomration needed
  const userID = user.id;
  const userTag = user.tag;
  const serverID = guild.id;
  // getting newly added ban
  guild.fetchBan(user)
    .then(async (ban) => {
      console.log(userID);
      console.log(userTag);
      console.log(serverID);
      console.log(ban.reason);
      // TODO: create DB entry
    });
};

module.exports.help = {
  name: 'EVENT_guildBanAdd',
};
