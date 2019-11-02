const Maintainer = require('../database/models/Maintainer');

module.exports.run = async (userID) => Maintainer.findOne({ where: { userID } })
  .catch((err) => console.error(err));

module.exports.help = {
  name: 'FUNC_checkUser',
};
