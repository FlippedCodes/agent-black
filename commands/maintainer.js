const Maintainer = require('../database/models/Maintainer');

module.exports.run = async (interaction) => {
  // check maintainer permissions
  if (!await client.functions.get('CHECK_DBperms').run(interaction.user.id)) {
    messageFail(interaction, `You are not authorized to use \`${module.exports.data.name}\``);
    return;
  }
  const subName = interaction.options.getSubcommand();
  client.commands.get(`${interaction.commandName}_${subName}`).run(interaction, Maintainer);
};

module.exports.data = new CmdBuilder()
  .setName('maintainer')
  .setDescription('Manages the maintainers. [MAINTAINER ONLY]')
  .addSubcommand((subcommand) => subcommand
    .setName('add')
    .setDescription('Adds an entry.')
    .addUserOption((option) => option.setName('user').setDescription('Provide a user to to add.').setRequired(true)))
  .addSubcommand((subcommand) => subcommand
    .setName('remove')
    .setDescription('Allow access to nsfw rooms.')
    .addUserOption((option) => option.setName('user').setDescription('Provide a user to to remove.').setRequired(true)))
  .addSubcommand((subcommand) => subcommand
    .setName('info')
    .setDescription('Change the DoB of an entry.')
    .addUserOption((option) => option.setName('user').setDescription('Provide a user you want to know more about.').setRequired(true)));
