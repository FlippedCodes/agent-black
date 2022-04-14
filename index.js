// init Discord
const { Client, Intents, Collection } = require('discord.js');
// init file system
const fs = require('fs');
// init command builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// setting essential global values
// init Discord client
global.client = new Client({
  disableEveryone: true,
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});
// init config
global.config = require('./config.json');

global.DEBUG = process.env.NODE_ENV === 'development';

global.CmdBuilder = SlashCommandBuilder;

global.ERR = (err) => {
  console.error('ERROR:', err);
  if (DEBUG) return;
  const { MessageEmbed } = require('discord.js');
  const embed = new MessageEmbed()
    .setAuthor({ name: `Error: '${err.message}'` })
    .setDescription(`STACKTRACE:\n\`\`\`${err.stack.slice(0, 4000)}\`\`\``)
    .setColor(16449540);
  client.channels.fetch(config.logChannel).send({ embeds: [embed] });
  return;
};

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
    fs.readdirSync('./functions/STARTUP').forEach((FCN) => {
      if (FCN.search('.js') === -1) return;
      const INIT = require(`./functions/STARTUP/${FCN}`);
      INIT.run(fs);
    });
  });

client.on('ready', async () => {
  // confirm user logged in
  console.log(`[${config.name}] Logged in as "${client.user.tag}"!`);

  // setup tables
  console.log('[DB] Syncing tables...');
  await sequelize.sync();
  await console.log('[DB] Done syncing!');

  // run startup functions
  config.setup.setupFunctions.forEach((FCN) => {
    client.functions.get(FCN).run(config);
  });
});

// EVENT user gets banned
client.on('guildBanAdd', (ban) => client.functions.get('EVENT_guildBanAdd').run(ban));

// EVENT user gets unbanned
client.on('guildBanRemove', (ban) => client.functions.get('EVENT_guildBanRemove').run(ban));

// user joins the server
client.on('guildMemberAdd', (member) => client.functions.get('EVENT_guildMemberAdd').run(member));

// bot joins the server
client.on('guildCreate', (guild) => client.functions.get('EVENT_guildCreate').run(guild));

// bot leaves the server
client.on('guildDelete', (guild) => client.functions.get('EVENT_guildDelete').run(guild));

// TODO: check what information is shared without message intent, so tag recording is still possible
// // record user tag
// client.functions.get('SET_DB_userTagRecord').run(member.id, member.user.tag);

// TODO: create a message event and let the suer know that the bot now uses slash commands
// TEMP: message Event gets removed once interactions are implemented on discord side
client.on('messageCreate', (message) => client.functions.get('EVENT_messageCreate').run(message));

// itneraction is triggered (command, autocomplete, etc.)
client.on('interactionCreate', (interaction) => client.functions.get('EVENT_interactionCreate').run(interaction));

// logging errors and warns
client.on('error', (ERR));
client.on('warn', (ERR));
process.on('uncaughtException', (ERR));
