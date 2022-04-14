module.exports.run = async (interaction) => {
  // only guild command
  // TODO: check if neseccary, because this seems to be a useless intent 'DIRECT_MESSAGES'
  // TODO: maybe check if command deployment to DM can be supressed
  if (!await interaction.inGuild()) return messageFail(interaction, 'The bot is for server-use only.');

  // autocomplete hanlder
  if (interaction.isAutocomplete()) return client.functions.get('EVENT_interaction_isAutocomplete').run(interaction).catch(ERR);
  // command handler
  if (interaction.isCommand()) return client.functions.get('EVENT_interaction_isCommand').run(interaction).catch(ERR);
};

module.exports.data = {
  name: 'interactionCreate',
};
