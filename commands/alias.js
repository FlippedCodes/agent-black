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
  }).catch(ERR);
  // return output;
}

async function checkAlias(userID) {
  const found = await UserAlias.findOne({ where: { userID } })
    .catch((err) => console.error(err));
  return found;
}

module.exports.run = async (interaction) => {
  // check permissions if user has teamrole
  if (!await client.functions.get('CHECK_DBperms').run(interaction.user.id, 'staff', interaction.guild.id, interaction.member)) {
    messageFail(interaction, `You are not authorized to use \`/${module.exports.data.name}\``);
    return;
  }

  const mainUser = await interaction.options.getUser('mainuser').id;
  const aliasUser = await interaction.options.getUser('user2').id;

  // get entries for both IDs
  const resultMainID = await checkAlias(mainUser);
  const resultAliasID = await checkAlias(aliasUser);
  // check if borth are already in aliases
  if (resultMainID && resultAliasID) {
    messageFail(interaction, 'Both users are already linked or in two different groupings!');
    return;
  }
  // add both if not found
  if (!resultMainID && !resultAliasID) {
    const groupingID = await interaction.id;
    [mainUser, aliasUser].forEach((uID) => addAlias(uID, groupingID, interaction.user.id));
    messageSuccess(interaction, 'Entry added!');
    return;
  }
  // add mainUser if not found
  if (!resultMainID && resultAliasID) {
    addAlias(mainUser, resultAliasID.groupingID, interaction.user.id);
    messageSuccess(interaction, 'Entry added!');
    return;
  }
  // add aliasUser if not found
  if (resultMainID && !resultAliasID) {
    console.log(resultAliasID);
    addAlias(aliasUser, resultMainID.groupingID, interaction.user.id);
    messageSuccess(interaction, 'Entry added!');
    return;
  }
};

module.exports.data = new CmdBuilder()
  .setName('alias')
  .setDescription('Add an alias for secound accounts.')
  .addUserOption((option) => option.setName('mainuser').setDescription('Provide the main user the person uses.').setRequired(true))
  .addUserOption((option) => option.setName('user2').setDescription('2. user').setRequired(true));
