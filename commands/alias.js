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
  }).catch(errHandler);
  // return output;
}

async function checkAlias(userID) {
  const found = await UserAlias.findOne({ where: { userID } })
    .catch((err) => console.error(err));
  return found;
}

// check for correct values
async function checkValues(message, prefix, mainUser, aliasUser) {
  if (!mainUser) {
    messageFail(message, CommandUsage(prefix, module.exports.help.name, 'MAINUSERID ALIASUSERID'));
    return false;
  }
  if (isNaN(mainUser)) {
    messageFail(message, CommandUsage(prefix, module.exports.help.name, 'MAINUSERID ALIASUSERID'));
    return false;
  }
  // check if ID exists as a user
  if (!await message.client.functions.get('FUNC_checkID').run(mainUser, message.client, 'user')) {
    messageFail(message, `A user with the ID \`${mainUser}\` doesn't exist!`);
    return false;
  }
  if (!aliasUser) {
    messageFail(message, CommandUsage(prefix, module.exports.help.name, `${mainUser} ALIASUSERID`));
    return false;
  }
  if (isNaN(aliasUser)) {
    messageFail(message, CommandUsage(prefix, module.exports.help.name, `${mainUser} ALIASUSERID`));
    return false;
  }
  // check if ID exists as a user
  if (!await message.client.functions.get('FUNC_checkID').run(aliasUser, message.client, 'user')) {
    messageFail(message, `A user with the ID \`${aliasUser}\` doesn't exist!`);
    return false;
  }
  return true;
}

module.exports.run = async (client, message, args, config, prefix) => {
  // check if run in dms
  if (message.channel.type === 'dm') return messageFail(message, 'This comamnd is for servers only.');

  // check if user is teammember
  if (!await client.functions.get('FUNC_checkPermissionsChannel').run(message.member, message, 'BAN_MEMBERS')) {
    messageFail(message, `You are not authorized to use \`${prefix}${module.exports.help.name}\``);
    return;
  }
  const [mainUser, aliasUser] = args;
  if (!await checkValues(message, prefix, mainUser, aliasUser)) return;
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
