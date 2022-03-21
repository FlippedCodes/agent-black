const config = require("../config/main.json");

const UserIDAssociation = require("../database/models/UserIDAssociation");

const cachedUsers = new Set();

function timeout(id) {
	cachedUsers.add(id);
	setTimeout(() => cachedUsers.delete(id), config.functions.userTagRecord.maxCacheTimeout);
}

module.exports.run = async (userID, userTag) => {
	// return in discriminator is "#0000"
	if (userTag.indexOf("#0000") !== -1) return;
	// check if user has said anything in the last 3hrs
	if (cachedUsers.has(userID)) return;
	// if not, add it
	timeout(userID);
	// and add entry to DB if not yet existent
	UserIDAssociation.findOrCreate({
		where: { userID },
		defaults: { userTag },
	})
		.catch(ERR);
};

module.exports.help = {
	name: "FUNC_userTagRecord",
};
