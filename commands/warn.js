const { MessageEmbed } = require('discord.js');

const Warn = require('../database/models/Warn');

// TODO: recreate richmessage embed sender to it can be sent to other servers

// checks if server is partisipating server
function getServerEntry(serverID) {
  return client.functions.get('GET_DB_server').run(serverID, true);
}

// warns other servers
async function messageWarnedUserInGuild(channelID, userTag, userID, warnMessage, serverName) {
  const embed = new MessageEmbed();
  embed.setColor(16755456);
  embed.setFooter({ text: `For more information about this user, use '/lookup ${userID}'` });
  embed.setTitle(`A user on your server has been warned on '${serverName}'!`);
  embed.setDescription(`Tag: \`${userTag}\`
  ID: \`${userID}\`
  Reason: \`\`\`${warnMessage || 'none'}\`\`\``);
  const channel = await client.channels.cache.get(channelID);
  channel.send({ embeds: [embed] });
}

// warns other servers for aliases
async function messageWarnedAliasUserInGuild(channelID, userTag, userID, warnMessage, serverName, orgUserTag) {
  const embed = new MessageEmbed();
  embed.setColor(16755456);
  embed.setFooter({ text: `For more information about this user, use '/lookup ${orgUserTag}'` });
  embed.setTitle(`An alias of a user on your server has been warned on '${serverName}'!`);
  embed.setDescription(`**The user \`${userTag}\` is an alias of a user that has been warned!**

  Tag: \`${orgUserTag}\`
  ID: \`${userID}\`
  Reason: \`\`\`${warnMessage || 'none'}\`\`\``);
  const channel = await client.channels.cache.get(channelID);
  channel.send({ embeds: [embed] });
}

async function checkforInfectedGuilds(guild, orgUserID, warnMessage) {
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

module.exports.run = async (interaction) => {
  // check maintainer permissions
  if (!await client.functions.get('CHECK_DB_perms').run(interaction.user.id, 'staff', interaction.guild.id, interaction.member)) {
    messageFail(interaction, `You are not authorized to use \`/${module.exports.data.name}\``);
    return;
  }
  const subName = interaction.options.getSubcommand(true);
  const warnMessage = interaction.options.getString('message', true);
  client.commands.get(`${module.exports.data.name}_${subName}`).run(interaction, warnMessage, Warn, checkforInfectedGuilds);
};

module.exports.data = new CmdBuilder()
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
