// init Discord
const { Client, Intents, Collection } = require("discord.js");
// init file system
const fs = require("fs");
// setting essential global values
// init Discord client
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
	],
});
global.client = client;
// init config
const config = require("./config.json");
global.config = config;

const DEBUG = process.env.NODE_ENV === "development";
global.DEBUG = DEBUG;

const ERR = (err) => {
	console.error("ERROR:", err);
	if (process.env.NODE_ENV === "development") return;
	const { MessageEmbed } = require("discord.js");
	const embed = new MessageEmbed()
		.setAuthor({ name: `Error: '${err.message}'` })
		.setDescription(`STACKTRACE:\n\`\`\`${err.stack.slice(0, 4000)}\`\`\``)
		.setColor(16449540);
	client.channels.cache.get(config.logChannel).send({ embeds: [embed] });
	return;
};
global.ERR = ERR;

const { messageFail } = require("./functions_old/GLBLFUNC_messageFail.js");

// creating collections
client.commands = new Collection();
client.functions = new Collection();

// anouncing debug mode
if (DEBUG) console.log(`[${config.name}] Bot is on Debug-Mode. Some functions are not going to be loaded.`);

// Login the bot
client.login(process.env.DCtoken)
// TODO: cleanup
	.then(() => {
		// import Functions and Commands; startup database connection
		fs.readdirSync("./functions/STARTUP").forEach((FCN) => {
			if (FCN.search(".js") === -1) return;
			const INIT = require(`./functions/STARTUP/${FCN}`);
			INIT.run(fs);
		});
	});

client.on("ready", async () => {
	// confirm user logged in
	console.log(`[${config.name}] Logged in as "${client.user.tag}"!`);

	// setup tables
	console.log("[DB] Syncing tables...");
	await sequelize.sync();
	await console.log("[DB] Done syncing!");

	// run startup functions
	config.setup.setupFunctions.forEach((FCN) => {
		client.functions.get(FCN).run(client, config);
	});
});

// // EVENT user gets banned
// client.on('guildBanAdd', async (guild, user) => {
//   if (await client.functions.get('FUNC_checkServer').run(guild.id, true)) {
//     client.functions.get('EVENT_guildBanAdd').run(guild, user);
//   }
// });

// // EVENT user gets unbanned
// client.on('guildBanRemove', async (guild, user) => {
//   if (await client.functions.get('FUNC_checkServer').run(guild.id, true)) {
//     client.functions.get('EVENT_guildBanRemove').run(guild, user);
//   }
// });

// // user joins the server
// client.on('guildMemberAdd', async (member) => {
//   if (await client.functions.get('FUNC_checkServer').run(member.guild.id, false)) {
//     client.functions.get('EVENT_guildMemberAdd').run(client, member);
//   }
// });

// // bot joins the server
// client.on('guildCreate', async (guild) => {
//   client.functions.get('EVENT_guildCreate').run(client, guild);
// });

// // bot leaves the server
// client.on('guildDelete', async (guild) => {
//   if (await client.functions.get('FUNC_checkServer').run(guild.id, true)) {
//     client.functions.get('EVENT_guildDelete').run(client, guild);
//   }
// });

client.on("interactionCreate", async (interaction) => {
	// only guild command
	if (!await interaction.inGuild()) return messageFail(client, interaction, "The bot is for server-use only.");

	// autocomplete hanlder
	if (interaction.isAutocomplete()) return client.functions.get("EVENT_autocomplete").run(interaction).catch(ERR);
	// command handler
	if (interaction.isCommand()) {
		// TODO: cleanup code to own event function
		// eslint-disable-next-line no-inner-declarations
		async function checkServer(serverID) {
			const ParticipatingServer = require("./database/models/ParticipatingServer");
			const found = await ParticipatingServer.findOne({ where: { serverID, blocked: true } })
				.catch((err) => console.error(err));
			return found;
		}
		const mainCMD = interaction.commandName.replace("_dev", "");
		// commands to let through, when guild is blocked
		const infoCMDs = ["about", "ping"];
		// check if blocked
		if (!infoCMDs.includes(mainCMD) && await checkServer(interaction.guild.id)) {
			messageFail(client, interaction, "It seems your server got blocked from the bot usage. If you want to know the reason and/or want to appeal, feel free to join the server linked in the help command.");
			return;
		}
		const command = client.commands.get(DEBUG ? mainCMD : interaction.commandName);
		if (command) {
			// if debuging trigger application thinking
			// TEMP: set to false to test some public commands
			if (DEBUG) await interaction.deferReply({ ephemeral: false });
			command.run(interaction).catch(ERR);
			return;
		}
	}
});

// logging errors and warns
client.on("error", (ERR));
client.on("warn", (ERR));
process.on("uncaughtException", (ERR));
