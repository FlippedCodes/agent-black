const UserIDAssociation = require('../database/models/UserIDAssociation');

global.userTagRecord = (userID, userTag) => {
  if (userTag.indexOf('#0000') !== -1) return;
  UserIDAssociation.findOrCreate({
    where: { userID },
    defaults: { userTag },
  })
    .catch(errHander);
};

module.exports.help = {
  name: 'GLBLFUNC_userTagRecord',
};
