const { messageFail } = require('../functions_old/GLBLFUNC_messageFail.js');
const { messageSuccess } = require('../functions_old/GLBLFUNC_messageSuccess.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const Ban = require('../database/models/Ban');

/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction  
 */
module.exports.run = async (client, interaction) => {
  // check owner permissions
  if (interaction.user.id !== '172031697355800577') return messageFail(client, interaction, `You are not authorized to use \`/${module.exports.data.name}\``);

  if (process.env.NODE_ENV != 'development') await interaction.deferReply();
  client.guilds.cache.forEach(async (guild) => {
    const bans = await guild.bans.fetch({ cache: false });
    await bans.forEach(async ({ user, reason }) => {
      const userTag = user.tag;
      const userBanned = true;
      const userID = user.id;
      const serverID = guild.id;
      let fixedReason = reason;
      if (reason !== null) fixedReason = reason.replace(new RegExp('\'', 'g'), '`');
      const [banEntry] = await Ban.findOrCreate({
        where: { userID, serverID },
        defaults: { reason: fixedReason, userTag, userBanned },
      }).catch(err => {
        if (err) throw err;
      });
      if (!banEntry.isNewRecord) {
        Ban.update({ reason: fixedReason, userBanned },
          { where: { userID, serverID } })
          .catch(err => {
            if (err) throw err;
          });
      }
    });
  })
    .then(() => {
      messageSuccess(interaction, 'Done');
    });
  setTimeout(() => {
    messageSuccess(interaction, 'Done!');
  }, client.guilds.cache.size * 300);
};

module.exports.data = new SlashCommandBuilder()
  .setName('syncallbans')
  .setDescription('Adds all bans from all participating servers. [OWNER ONLY].');
