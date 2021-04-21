const UserAlias = require('../database/models/UserAlias');

// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
  return `Command usage: 
    \`\`\`${prefix}${cmdName} ${subcmd}\`\`\``;
}

async function addAlias(mainUser, aliasUser, addedBy) {
  const [output] = await UserAlias.findOrCreate({
    where: { mainUser, aliasUser },
    defaults: { addedBy },
  }).catch(errHander);
  return output;
}

async function checkAlias(mainUser, aliasUser) {
  const found = await UserAlias.findOne({ where: { mainUser, aliasUser } })
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
  if (!await message.client.functions.get('FUNC_checkID').run(aliasUser, message.client, 'user')) {
    messageFail(message, `A user with the ID \`${aliasUser}\` doesn't exist!`);
    return false;
  }
  // check for existing id
  // let exist = true;
  // await [mainUser, aliasUser].forEach(async (uID) => {
  //   if (!await message.client.functions.get('FUNC_checkID').run(uID, message.client, 'user')) {
  //     exist = false;
  //     await messageFail(message, `A user with the ID \`${uID}\` doesn't exist!`);
  //   }
  // });
  return true;
}

module.exports.run = async (client, message, args, config) => {
  // command usame checking
  // ckeck if both ids are valid
  // command handler
  // add, remove
  if (message.channel.type === 'dm') return messageFail(message, 'This comamnd is for servers only.');
  // check if user is teammember
  if (!message.member.roles.cache.find(({ id }) => id === config.teamRole)) return messageFail(message, `You are not authorized to use \`${config.prefix}${module.exports.help.name}\``);
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
  if (await checkAlias(mainUser, aliasUser)) {
    messageFail(message, 'Entry already exists!');
    return;
  }
  if (!await addAlias(mainUser, aliasUser, message.author.id)) {
    messageFail(message, 'Something went wrong...');
    return;
  }
  messageSuccess(message, 'Added entry!');
};

module.exports.help = {
  name: 'alias',
  usage: 'MAINUSERID ALIASUSERID',
  desc: 'Add an alias for secound accounts.',
};
