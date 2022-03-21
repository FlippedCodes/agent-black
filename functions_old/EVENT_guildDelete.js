const ParticipatingServer = require("../database/models/ParticipatingServer");

const ERR = (err) => {
	console.error("ERROR:", err);
};

// removes a server from the ParticipatingServers table
async function removeServer(serverID) {
	const success = await ParticipatingServer.update(
		{ active: false },
		{ where: { serverID, active: true } },
	)
		.catch(ERR);
	return success[0];
}

module.exports.run = async (client, guild) => {
	await removeServer(guild.id);
};

module.exports.help = {
	name: "EVENT_guildDelete",
};
