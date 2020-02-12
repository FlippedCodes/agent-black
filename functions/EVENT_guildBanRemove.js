const Ban = require('../database/models/Ban');

// error-handler for event-function
const errHander = (err) => {
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
    .catch(errHander);
  // TODO: check if user is banned left server: post info message with servercount
};

module.exports.help = {
  name: 'EVENT_guildBanRemove',
};
