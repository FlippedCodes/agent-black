module.exports.run = async (ID, client, type) => {
	let existingID = false;

	switch (type) {
	case "server":
		if (client.guilds.cache.find((server) => server.id === ID)) existingID = true;
		return existingID;

	case "sharedUser":
		if (client.users.cache.find((user) => user.id === ID)) existingID = true;
		return existingID;

	case "user":
		existingID = true;
		await client.users.fetch(ID, false)
			.catch(() => existingID = false);
		return existingID;

	case "channel":
		if (client.channels.cache.find((channel) => channel.id === ID)) existingID = true;
		return existingID;

	default:
		return null;
	}
};

module.exports.help = {
	name: "FUNC_checkID",
};
