const { MessageEmbed } = require('discord.js');

const Ban = require('../database/models/Ban');

module.exports.run = async (interaction) => {
  // check maintainer permissions
  if (!await client.functions.get('CHECK_DB_perms').run(interaction.user.id)) {
    messageFail(interaction, `You are not authorized to use \`/${module.exports.data.name}\``);
    return;
  }

  const server = interaction.options.getString('server') || interaction.guild;

  const serverID = server.id;

  await reply(interaction, { embeds: [new MessageEmbed().setAuthor({ name: 'Processing banlist...' })] });

  const bans = await server.fetchBans(true).catch(ERR);
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

  await reply(interaction, { embeds: [new MessageEmbed().setAuthor({ name: `Done importing **${server.name}**!` })] });
};

module.exports.data = new CmdBuilder()
  .setName('syncbans')
  .setDescription('Adds all bans from the current server its beeing used in. [MAINTAINER ONLY]')
  .addStringOption((option) => option
    .setName('server')
    .setDescription('Provide a guild ID you want to edit.')
    .setAutocomplete(true));
