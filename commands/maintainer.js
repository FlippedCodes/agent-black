const Maintainer = require('../database/models/Maintainer');

// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
  return `Command usage: 
    \`\`\`${prefix}${cmdName} ${subcmd} USERID\`\`\``;
}

// creates a embed messagetemplate for succeded actions
function messageSuccess(client, message, body) {
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 4296754, false);
}

// creates a embed messagetemplate for failed actions
function messageFail(client, message, body) {
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false);
}

// adds a user to the Maintainer table
async function addUser(Maintainer, userID) {
  const added = await Maintainer.findOrCreate(
    {
      where: { userID },
    },
  ).catch((err) => console.error(err));
  const created = await added[1];
  return created;
}

// removes a user from the Maintainer table
async function removeUser(Maintainer, userID) {
  const destroyed = await Maintainer.destroy({ limit: 1, where: { userID } });
  return destroyed;
}

// finds a user in the Maintainers table
async function findUser(Maintainer, userID) {
  const found = await Maintainer.findOne({ where: { userID } })
    .catch((err) => console.error(err));
  return found;
}

module.exports.run = async (client, message, args, config) => {
  // get subcmd from args
  const [subcmd, userID] = args;

  if (!await client.functions.get('FUNC_checkUser').run(message.author.id)) {
    messageFail(client, message, `You are not authorized to use \`${config.prefix}${module.exports.help.name} ${subcmd}\``);
    return;
  }

  switch (subcmd) {
    // adds a userentry
    case 'add':
      // check provided information
      if (!userID) {
        messageFail(CommandUsage(config.prefix, module.exports.help.name, subcmd));
        return;
      }
      if (!await client.functions.get('FUNC_checkID').run(userID, client, 'user')) {
        messageFail(client, message, `The user with the ID \`${userID}\` doesn't exist or the bot is not sharing a server with them.`);
        return;
      }
      // add server
      const userAdded = await addUser(Maintainer, userID);
      // post outcome
      if (userAdded) {
        messageSuccess(client, message,
          `<@${userID}> with the ID \`${userID}\` got added to the maintainers list.`);
      } else {
        messageFail(client, message,
          `The entry for the user <@${userID}> with the ID \`${userID}\` already exists!`);
      }
      return;

    // removes a userentry
    case 'remove':
      if (!userID) {
        messageFail(CommandUsage(config.prefix, module.exports.help.name, subcmd));
        return;
      }
      const userRemoved = await removeUser(Maintainer, userID);
      if (userRemoved >= 1) {
        messageSuccess(client, message,
          `The user with the ID \`${userID}\` got removed from the maintainers list.`);
      } else {
        messageFail(client, message,
          `The user with the ID \`${userID}\` couldn't be found of the list.`);
      }
      return;

    // shows info about a userentry
    case 'info':
      if (!userID) {
        messageFail(CommandUsage(config.prefix, module.exports.help.name, subcmd));
        return;
      }
      const userFound = await findUser(Maintainer, userID);
      if (userFound) {
        const userID = userFound.userID;
        messageSuccess(client, message,
          `User tag: <@${userID}>
          User ID: \`${userID}\`
          Maintainer since \`${userFound.createdAt}\``);
      } else {
        messageFail(client, message,
          `The user with the ID \`${userID}\` couldn't be found in the list.`);
      }
      return;

    default:
      messageFail(client, message,
        `Command usage: 
        \`\`\`${config.prefix}${module.exports.help.name} ${module.exports.help.usage}\`\`\``);
      return;
  }
};

module.exports.help = {
  name: 'maintainer',
  usage: 'add|remove|info',
  desc: 'Manages the maintainers.',
};
