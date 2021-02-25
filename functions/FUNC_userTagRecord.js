const UserIDAssociation = require('../database/models/UserIDAssociation');

const cachedUsers = [];

module.exports.run = async (userID, userTag) => {
  if (userTag.indexOf('#0000') !== -1) return;
  if (cachedUsers.find((id) => id === userID)) return;
  UserIDAssociation.findOrCreate({
    where: { userID },
    defaults: { userTag },
  })
    .catch(errHander);
  cachedUsers.push(userID);
};

module.exports.help = {
  name: 'FUNC_userTagRecord',
};
