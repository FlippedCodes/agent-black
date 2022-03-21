const { MessageEmbed } = require("discord.js");

const Ban = require("../database/models/Ban");

const Warn = require("../database/models/Warn");

const config = require("../config/main.json");

// error Handler
const ERR = (err) => {
	console.error("ERROR:", err);
};

// checks if server is participating server
function getServerEntry(client, serverID) {
	return client.functions.get("FUNC_checkServer").run(serverID, false);
}

// get log channel of server
function findLogChannel(client, logChannelID) {
	return client.channels.cache.find((channel) => channel.id === logChannelID);
}

// send message when user is banned
async function sendMessage(client, prefix, serverID, userID, userTag, userBans, userWarns, alias, orgUserTag) {
	const server = await getServerEntry(client, serverID);
	const logChannelID = server.logChannelID;
	const logChannel = await findLogChannel(client, logChannelID);
	const serverName = server.serverName;

	// update title, when alias
	let title = `Known user joined '${serverName}'`;
	if (alias) title = `Alias of '${orgUserTag}'`;

	client.functions.get("FUNC_richEmbedMessage")
		.run(client.user, logChannel, `tag: \`${userTag}\`
    ID: \`${userID}\`
    bans: \`${userBans}\`
    warns: \`${userWarns}\`
    For more information use \`/lookup ${userID}\``, title, 16739072, false);
}

module.exports.run = async (client, member) => {
	// record user tag
	client.functions.get("FUNC_userTagRecord").run(member.id, member.user.tag);
	// check if user is banned on some server
	const [serverID, orgUserID, orgUserTag] = [member.guild.id, member.id, member.user.tag];
	// get all bans and warnings the joined user has
	const userBans = await Ban.count({ where: { userID: orgUserID } }).catch(ERR);
	const userWarns = await Warn.count({ where: { userID: orgUserID } }).catch(ERR);
	// calculate sum and check if sum is 0
	const overallAmmount = userBans + userWarns;
	if (overallAmmount === 0) return;
	// post message
	sendMessage(client, "a!", serverID, orgUserID, orgUserTag, userBans, userWarns);

	// lookup aliases
	// check if user has aliases
	const output = await client.functions.get("FUNC_checkAlias").run(member.id);
	if (output) {
		output.forEach(async (aliasUserID) => {
			if (orgUserID === aliasUserID) return;
			const aliasUser = await client.users.fetch(aliasUserID, false).catch(ERR);
			const aliasUserBans = await Ban.count({ where: { userID: aliasUserID } }).catch(ERR);
			const aliasUserWarns = await Warn.count({ where: { userID: aliasUserID } }).catch(ERR);
			sendMessage(client, "a!", serverID, aliasUserID, aliasUser.tag, aliasUserBans, aliasUserWarns, true, orgUserTag);
		});
	}
};

module.exports.help = {
	name: "EVENT_guildMemberAdd",
};
