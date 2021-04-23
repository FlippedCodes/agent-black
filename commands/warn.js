const config = require('../config/main.json');

const Warn = require('../database/models/Warn');

// adds a Warn to the warning table
async function addWarn(serverID, userID, reason) {
  await Warn.create({ userID, serverID, reason })
    .catch(errHandler);
}

// edits a Warn to the warning table
async function editWarn(warnID, reason) {
  Warn.update({ reason }, { where: { warnID } })
    .catch(errHandler);
}

// checks if server is partisipating server
function getServerEntry(client, serverID) {
  return client.functions.get('FUNC_checkServer').run(serverID, true);
}

// creates a embed messagetemplate for failed actions
async function messageBannedUserInGuild(client, prefix, channelID, userTag, userID, warnReason, serverName) {
  const channel = await client.channels.cache.get(channelID);
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, channel,
      `Tag: \`${userTag}\`
      ID: \`${userID}\`
      Reason: \`${warnReason || 'none'}\``,
      `A user on your server has been warned on '${serverName}'!`,
      16755456,
      `For more information and other bans and warns use '${prefix}lookup ${userID}'`);
}

function checkforInfectedGuilds(client, guild, userID, warnReason) {
  client.guilds.cache.forEach(async (toTestGuild) => {
    if (guild.id === toTestGuild.id) return;
    const serverMember = toTestGuild.members.cache.get(userID);
    if (serverMember) {
      const serverID = toTestGuild.id;
      const infectedGuild = await getServerEntry(client, serverID);
      if (infectedGuild && infectedGuild.active && infectedGuild.logChannelID) {
        messageBannedUserInGuild(client, prefix, infectedGuild.logChannelID, serverMember.user.tag, userID, warnReason, guild.name);
      }
    }
  });
}

async function getWarning(warnID) {
  const found = await Warn.findOne({ where: { warnID } })
    .catch(errHandler);
  return found;
}

module.exports.run = async (client, message, args, config, prefix) => {
  // get subcmd from args
  const [subcmd, userIDOrWarnID, reasonTesting] = args;

  // check permissions if MANAGE_MESSAGES and if send in DMs
  if (!await client.functions.get('FUNC_checkPermissions').run(message.member, message, 'MANAGE_MESSAGES')) {
    messageFail(message, `You are not authorized to use \`${prefix}${module.exports.help.name}\``);
    return;
  }

  // eslint doesnt like have a double const declaration in 2 cases for some reason
  let slicedReason;

  switch (subcmd) {
    // adds a waring to a user
    case 'add':
      // check provided information
      if (!userIDOrWarnID || !reasonTesting) {
        messageFail(message,
          `Command usage: 
          \`\`\`${prefix}${module.exports.help.name} ${subcmd} ${userIDOrWarnID || 'USERID'} MESSAGE\`\`\``);
        return;
      }
      // check if user exists
      if (!await client.functions.get('FUNC_checkID').run(userIDOrWarnID, client, 'user')) {
        messageFail(message, `The user with the ID \`${userIDOrWarnID}\` doesn't exist.`);
        return;
      }
      // slice reason
      slicedReason = await args.join(' ').slice(subcmd.length + 1 + userIDOrWarnID.length + 1);
      // add warn
      await addWarn(message.guild.id, userIDOrWarnID, slicedReason);
      messageSuccess(message, `The user with the ID \`${userIDOrWarnID}\` got a new warning added.\n Warning other servers.`);
      checkforInfectedGuilds(client, message.guild, userIDOrWarnID, slicedReason);
      return;

    // edit a warning
    case 'edit':
      // check provided information
      if (!userIDOrWarnID || !reasonTesting) {
        messageFail(message,
          `Command usage:
          \`\`\`${prefix}${module.exports.help.name} ${subcmd} ${userIDOrWarnID || 'WARNID'} MESSAGE\`\`\``);
        return;
      }
      // check if user exists
      if (isNaN(userIDOrWarnID)) {
        messageFail(message, 'This is not a warn-ID!');
        return;
      }
      const serverID = message.guild.id;
      const warning = await getWarning(userIDOrWarnID);
      // check if warn is existent
      if (!warning) {
        messageFail(message, 'A Warning with this ID doesn\'t exist!');
        return;
      }
      // check if warn is from the same server
      if (warning.serverID !== serverID) {
        messageFail(message, 'You can only edit warnings form the server where they have been issues from.');
        return;
      }
      // slice reason
      slicedReason = await args.join(' ').slice(subcmd.length + 1 + userIDOrWarnID.length + 1);
      // add warn
      await editWarn(userIDOrWarnID, slicedReason);
      messageSuccess(message, `The warning with the the ID ${userIDOrWarnID} has been edited. Warning other servers.`);
      checkforInfectedGuilds(client, message.guild, warning.userID, slicedReason);
      return;

    default:
      messageFail(message,
        `Command usage: 
        \`\`\`${prefix}${module.exports.help.name} ${module.exports.help.usage}\`\`\``);
      return;
  }
};

module.exports.help = {
  name: 'warn',
  usage: 'add|edit',
  desc: 'Warns other servers about a specific user.',
};
