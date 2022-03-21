const { messageFail } = require('../functions_old/GLBLFUNC_messageFail.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const Warn = require('../database/models/Warn');

// TODO: recreate richmessage embed sender to it can be sent to other servers

// checks if server is partisipating server
function getServerEntry(client, serverID) {
  return client.functions.get('GET_DB_server').run(serverID, true);
}

// warns other servers
async function messageWarnedUserInGuild(client, channelID, userTag, userID, warnMessage, serverName) {
  const channel = await client.channels.cache.get(channelID);
  // TODO: Create a richembed on the spot instead of passing it to a function
  // - GitHub/Coder-Tavi
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, channel,
      `Tag: \`${userTag}\`
      ID: \`${userID}\`
      Reason: \`\`\`${warnMessage || 'none'}\`\`\``,
      `A user on your server has been warned on '${serverName}'!`,
      16755456,
      `For more information about this user, use '/lookup ${userID}'`);
}

// warns other servers for aliases
async function messageWarnedAliasUserInGuild(client, channelID, userTag, userID, warnMessage, serverName, orgUserTag) {
  const channel = await client.channels.cache.get(channelID);
  client.functions.get('richEmbedMessage')
    .run(client.user, channel,
      `**The user \`${userTag}\` is an alias of a user that has been warned!**

      Tag: \`${orgUserTag}\`
      ID: \`${userID}\`
      Reason: \`\`\`${warnMessage || 'none'}\`\`\``,
      `An alias of a user on your server has been warned on '${serverName}'!`,
      16755456,
      `For more information about this user, use '/lookup ${orgUserTag}'`);
}

async function checkforInfectedGuilds(client, guild, orgUserID, warnMessage) {
  let aliases = await client.functions.get('GET_DB_alias').run(orgUserID);
  if (!aliases) aliases = [orgUserID];
  const orgUser = await client.users.fetch(orgUserID, false);
  // look for each of the conencted users (alias) if they are a member in the corresponding guild
  aliases.forEach((userID) => {
    client.guilds.cache.forEach(async (toTestGuild) => {
      // dont post in own guild
      // TODO: warn own server that there are aliases: let through, if user is not the same as who a warn was issued for
      if (guild.id === toTestGuild.id) return;
      const serverMember = toTestGuild.members.cache.get(userID);
      if (!serverMember) return;
      const serverID = toTestGuild.id;
      const infectedGuild = await getServerEntry(serverID);
      if (infectedGuild && infectedGuild.active && infectedGuild.logChannelID) {
        if (orgUserID === userID) messageWarnedUserInGuild(infectedGuild.logChannelID, orgUser.tag, orgUserID, warnMessage, guild.name);
        else messageWarnedAliasUserInGuild(infectedGuild.logChannelID, serverMember.user.tag, orgUserID, warnMessage, guild.name, orgUser.tag);
      }
    });
  });
}

/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 * @returns 
 */
module.exports.run = async (client, interaction) => {
  // check maintainer permissions
  if (!await client.functions.get('CHECK_DB_perms').run(interaction.user.id, 'staff', interaction.guild.id, interaction.member)) {
    messageFail(client, interaction, `You are not authorized to use \`/${module.exports.data.name}\``);
    return;
  }
  const subName = interaction.options.getSubcommand(true);
  const warnMessage = interaction.options.getString('message', true);
  client.commands.get(`${module.exports.data.name}_${subName}`).run(client, interaction, warnMessage, Warn, checkforInfectedGuilds);
};

module.exports.data = new SlashCommandBuilder()
  .setName('warn')
  .setDescription('Warns other servers about a specific user.')
  .addSubcommand((SC) => SC
    .setName('add')
    .setDescription('Add warning.')
    .addUserOption((option) => option.setName('user').setDescription('Provide a user.').setRequired(true))
    .addStringOption((option) => option
      .setName('message')
      .setDescription('Message this warning should be.')
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('edit')
    .setDescription('Edit a existing warning.')
    .addNumberOption((option) => option
      .setName('warnid')
      .setDescription('Provide the warn ID of the one you want to edit.')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('message')
      .setDescription('Message this warning should be.')
      .setRequired(true)));
