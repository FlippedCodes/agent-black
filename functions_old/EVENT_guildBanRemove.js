const Ban = require('../database/models/Ban');

// error-handler for event-function
const ERR = (err) => {
  console.error('ERROR:', err);
};

module.exports.run = async (guild, user) => {
  // setting userBanned value to false for existing ban
  const userID = user.id;
  const serverID = guild.id;
  // update ban-DB entry
  Ban.update({ userBanned: false },
    { where: { userID, serverID } })
    .catch(ERR);
};

module.exports.help = {
  name: 'EVENT_guildBanRemove',
};
