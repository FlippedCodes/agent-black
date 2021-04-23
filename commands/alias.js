const UserAlias = require('../database/models/UserAlias');

// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
  return `Command usage: 
    \`\`\`${prefix}${cmdName} ${subcmd}\`\`\``;
}

function addAlias(userID, groupingID, addedBy) {
  // const [output] = await UserAlias.findOrCreate({
  UserAlias.findOrCreate({
    where: { userID, groupingID },
    defaults: { addedBy },
  }).catch(errHander);
  // return output;
}

async function checkAlias(userID) {
  const found = await UserAlias.findOne({ where: { userID } })
    .catch((err) => console.error(err));
  return found;
}

// check for correct values
async function checkValues(message, config, mainUser, aliasUser) {
  if (!mainUser) {
    messageFail(message, CommandUsage(config.prefix, module.exports.help.name, 'MAINUSERID ALIASUSERID'));
    return false;
  }
  if (isNaN(mainUser)) {
    messageFail(message, CommandUsage(config.prefix, module.exports.help.name, 'MAINUSERID ALIASUSERID'));
    return false;
  }
  // check if ID exists as a user
  if (!await message.client.functions.get('FUNC_checkID').run(mainUser, message.client, 'user')) {
    messageFail(message, `A user with the ID \`${mainUser}\` doesn't exist!`);
    return false;
  }
  if (!aliasUser) {
    messageFail(message, CommandUsage(config.prefix, module.exports.help.name, `${mainUser} ALIASUSERID`));
    return false;
  }
  if (isNaN(aliasUser)) {
    messageFail(message, CommandUsage(config.prefix, module.exports.help.name, `${mainUser} ALIASUSERID`));
    return false;
  }
  // check if ID exists as a user
  if (!await message.client.functions.get('FUNC_checkID').run(aliasUser, message.client, 'user')) {
    messageFail(message, `A user with the ID \`${aliasUser}\` doesn't exist!`);
    return false;
  }
  return true;
}

module.exports.run = async (client, message, args, config) => {
  // command usame checking
  // ckeck if both ids are valid
  // command handler
  // add, remove
  if (message.channel.type === 'dm') return messageFail(message, 'This comamnd is for servers only.');
  // check if user is teammember
  if (!await client.functions.get('FUNC_checkPermissions').run(message.member, message, 'BAN_MEMBERS')) {
    messageFail(message, `You are not authorized to use \`${config.prefix}${module.exports.help.name}\``);
    return;
  }
  const [mainUser, aliasUser] = args;
  // DISABLED: might get added later
  // const commandValues = ['add', 'remove'];
  // const currentCMD = module.exports.help;
  // if (commandValues.toLowerCase().includes(subcmd)) {
  //   if (subcmd === 'enable' || await checkFeature(message.guild.id)) {
  //     client.functions.get(`CMD_${currentCMD.name}_${subcmd}`)
  //       .run(client, message, args, config);
  //   } else messageFail(message, `To use the comamnds, you need to enable the feature in this server first!\n${CommandUsage(config.prefix, currentCMD.name, 'enable true')}`);
  // } else messageFail(message, CommandUsage(config.prefix, currentCMD.name, commandValues.join('|')));
  if (!await checkValues(message, config, mainUser, aliasUser)) return;
  // get entries for both IDs
  const resultMainID = await checkAlias(mainUser);
  const resultAliasID = await checkAlias(aliasUser);
  // check if borth are already in aliases
  if (resultMainID && resultAliasID) {
    messageFail(message, 'Both users are in two different groupings or are already linked!');
    return;
  }
  // add both if not found
  if (!resultMainID && !resultAliasID) {
    const groupingID = await message.id;
    [mainUser, aliasUser].forEach((uID) => addAlias(uID, groupingID, message.author.id));
    messageSuccess(message, 'Added entry!');
    return;
  }
  // add mainUser if not found
  if (!resultMainID && resultAliasID) {
    addAlias(mainUser, resultAliasID.groupingID, message.author.id);
    messageSuccess(message, 'Added entry!');
    return;
  }
  // add aliasUser if not found
  if (resultMainID && !resultAliasID) {
    console.log(resultAliasID);
    addAlias(aliasUser, resultMainID.groupingID, message.author.id);
    messageSuccess(message, 'Added entry!');
    return;
  }
};

module.exports.help = {
  name: 'alias',
  usage: 'MAINUSERID ALIASUSERID',
  desc: 'Add an alias for secound accounts.',
};
