const { EmbedBuilder } = require('discord.js');

const Ban = require('../database/models/Ban');

module.exports.run = async (interaction) => {
  // check maintainer permissions
  if (!await client.functions.get('CHECK_DB_perms').run(interaction.user.id)) {
    messageFail(interaction, `You are not authorized to use \`/${module.exports.data.name}\``);
    return;
  }

  const serverID = interaction.options.getString('server');

  const server = await interaction.client.guilds.cache.find((guild) => guild.id === serverID);

  if (!server) return messageFail(interaction, 'Sorry, but I am unable to find that server.');

  if (!DEBUG) await interaction.deferReply({ ephemeral: false });

  const bans = await server.bans.fetch({ cache: false }).catch(ERR);
  await bans.forEach(async ({ user, reason: reasonRaw }) => {
    const reason = reasonRaw === null ? reasonRaw : reasonRaw.replace(new RegExp('\'', 'g'), '`');
    const userID = user.id;
    const userBanned = true;
    const userTag = user.tag;

    const [banEntry] = await Ban.findOrCreate({
      where: { userID, serverID },
      defaults: { reason, userTag, userBanned },
    }).catch(ERR);
    if (!banEntry.isNewRecord) {
      Ban.update({ reason, userBanned },
        { where: { userID, serverID } })
        .catch(ERR);
    }
  });

  await reply(interaction, { embeds: [new EmbedBuilder().setAuthor({ name: `Done importing bans from ${server.name}!` })] });
};

module.exports.data = new CmdBuilder()
  .setName('syncbans')
  .setDescription('Adds all bans from the current server its beeing used in. [MAINTAINER ONLY]')
  .addStringOption((option) => option
    .setName('server')
    .setDescription('Provide a guild ID you want to edit.')
    .setAutocomplete(true)
    // Needs to be required, otherwise servername is passed and not the serverID from Autocomplete
    .setRequired(true));
