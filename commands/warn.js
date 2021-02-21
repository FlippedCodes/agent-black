const config = require('../config/main.json');

const Warn = require('../database/models/Warn');

// adds a server to the ParticipatingServers table
async function addWarn(serverID, userID, reason) {
  await Warn.create({ userID, serverID, reason })
    .catch(errHander);
}

// checks if server is partisipating server
function getServerEntry(client, serverID) {
  return client.functions.get('FUNC_checkServer').run(serverID, true);
}

// creates a embed messagetemplate for failed actions
async function messageBannedUserInGuild(client, channelID, userTag, userID, warnReason, serverName) {
  const channel = await client.channels.cache.get(channelID);
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, channel,
      `Tag: \`${userTag}\`
      ID: \`${userID}\`
      Reason: \`${warnReason || 'none'}\``,
      `A user on your server has been warned on '${serverName}'!`,
      16755456,
      `For more information and other bans and warns use '${config.prefix}lookup ${userID}'`);
}

function checkforInfectedGuilds(client, guild, userID, warnReason) {
  client.guilds.cache.forEach(async (toTestGuild) => {
    if (guild.id === toTestGuild.id) return;
    const serverMember = toTestGuild.members.cache.get(userID);
    if (serverMember) {
      const serverID = toTestGuild.id;
      const infectedGuild = await getServerEntry(client, serverID);
      if (infectedGuild && infectedGuild.active && infectedGuild.logChannelID) {
        messageBannedUserInGuild(client, infectedGuild.logChannelID, serverMember.user.tag, userID, warnReason, guild.name);
      }
    }
  });
}

module.exports.run = async (client, message, args, config) => {
  // get subcmd from args
  const [subcmd, userIDOrWarnID, reasonTesting] = args;

  // check userpermissions
  if (!await client.functions.get('FUNC_checkUser').run(message.author.id)) {
    messageFail(message, `You are not authorized to use \`${config.prefix}${module.exports.help.name} ${subcmd}\``);
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
          \`\`\`${config.prefix}${module.exports.help.name} ${subcmd} ${userIDOrWarnID || 'USERID'} MESSAGE\`\`\``);
        return;
      }
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
          \`\`\`${config.prefix}${module.exports.help.name} ${subcmd} ${userIDOrWarnID || 'WARNID'} MESSAGE\`\`\``);
        return;
      }
      if (!await client.functions.get('FUNC_checkID').run(userIDOrWarnID, client, 'user')) {
        messageFail(message, `The user with the ID \`${userIDOrWarnID}\` doesn't exist.`);
        return;
      }
      // slice reason
      slicedReason = await args.join(' ').slice(subcmd.length + 1 + userIDOrWarnID.length + 1);
      // add warn
      await editWarn(userIDOrWarnID, slicedReason);
      messageSuccess(message, `The user with the ID \`${userIDOrWarnID}\` got a new warning added.\n Warning other servers.`);
      return;

    default:
      messageFail(message,
        `Command usage: 
        \`\`\`${config.prefix}${module.exports.help.name} ${module.exports.help.usage}\`\`\``);
      return;
  }
};

module.exports.help = {
  name: 'warn',
  // usage: 'add|edit',
  usage: 'add',
  desc: 'Warns other servers about a specific user.',
};
