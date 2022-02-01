module.exports.run = async (interaction) => {
  // check maintainer permissions
  if (!await client.functions.get('CHECK_DB_perms').run(interaction.user.id)) {
    interaction.respond([{ name: `You are not authorized to use \`/${module.exports.data.name}\``, value: '0' }]);
    return;
  }

  const command = interaction.options.getFocused(true);
  const guild = interaction.options.getString('server');
  const response = await client.functions.get(`AUTOCOMPLETE_RESOLVE_${command.name}`).run(command.value, guild).catch(ERR);
  return interaction.respond(response);
};

module.exports.data = {
  name: 'guildmgr',
};
