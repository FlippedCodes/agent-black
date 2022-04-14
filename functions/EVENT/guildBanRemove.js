const Ban = require('../../database/models/Ban');

module.exports.run = async ({ guild, user }) => {
  // check if server is setup
  if (!await client.functions.get('GET_DB_registered').run(guild.id, false)) return;
  // setting userBanned value to false for existing ban
  const userID = user.id;
  const serverID = guild.id;
  // update ban-DB entry
  Ban.update({ userBanned: false }, { where: { userID, serverID } }).catch(ERR);
};

module.exports.data = {
  name: 'guildBanRemove',
};
