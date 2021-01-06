const UserIDAssociation = require('../database/models/UserIDAssociation');

global.userTagRecord = (userID, userTag) => {
  UserIDAssociation.findOrCreate({
    where: { userID },
    defaults: { userTag },
  })
    .catch(errHander);
};

module.exports.help = {
  name: 'GLBLFUNC_userTagRecord',
};
