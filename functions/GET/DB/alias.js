const UserAlias = require('../../../database/models/UserAlias');

async function getGroupID(userID) {
  const found = await UserAlias.findOne({ where: { userID } })
    .catch(ERR);
  return found;
}

async function getUserIDs(groupingID) {
  const found = await UserAlias.findAll({ where: { groupingID } })
    .catch(ERR);
  return found;
}

module.exports.run = async (userID) => {
  const groupID = await getGroupID(userID);
  if (!groupID) return;
  const users = await getUserIDs(groupID.groupingID);
  return users.map((user) => user.userID);
};

module.exports.data = {
  name: 'alias',
};

// update table to make pairs and check then for the pair, makes easyer sql questioning
// when adding a user, check if user OR ALIAS is already in a pair and add the new user to it
// when both users are in a pair throw error
