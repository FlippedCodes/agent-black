const Ban = require('../database/models/Ban');

// error-handler for event-function
const errHandler = (err) => {
  console.error('ERROR:', err);
};

module.exports.run = async (guild, user) => {
  // setting userBanned value to false for existing ban
  const userID = user.id;
  const serverID = guild.id;
  const userBanned = false;
  // update ban-DB entry
  Ban.update({ userBanned },
    { where: { userID, serverID } })
    .catch(errHandler);
};

module.exports.help = {
  name: 'EVENT_guildBanRemove',
};
