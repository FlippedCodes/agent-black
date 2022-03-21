/*
This function provides a autocomplete for roles in another server.
This is needed, as discords built in search only searches the server where the command is executed in.
*/

module.exports.run = async (searchInput, guildId) => {
	// if (searchInput.length <= 2) return [];

	const guild = client.guilds.cache.find((guild) => guild.id === guildId);
	if (!guild) return [{ name: "Define server first.", value: "0" }];

	const roles = guild.roles.cache;

	// id search
	if (searchInput !== "" && !isNaN(searchInput)) {
		const found = roles.find((role) => role.id === searchInput);
		if (found) return [{ name: found.name, value: found.id }];
		return [{ name: "Unkown", value: searchInput }];
	}

	// text search
	const channelReply = await roles
		.filter((role) => role.name.toLowerCase().search(searchInput.toLowerCase()) !== -1)
		.map((role) => ({ name: role.name, value: role.id }));
	return channelReply.slice(0, 24);
};

module.exports.data = {
	name: "server",
};
