const Ban = require('../database/models/Ban');

const errHander = (err) => {
  console.error('ERROR:', err);
};

module.exports.run = async (guild, user) => {
  // setting userBanned value to false for existing ban
  const userID = user.id;
  const serverID = guild.id;
  const userBanned = false;
  Ban.update({ userBanned },
    { where: { userID, serverID } })
    .catch(errHander);
};

module.exports.help = {
  name: 'EVENT_guildBanRemove',
};
