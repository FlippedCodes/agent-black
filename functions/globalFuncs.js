global.messageFail = async (interaction, body, color, ephemeral) => {
  const sentMessage = await client.functions.get('richEmbedMessage')
    .run(interaction, body, '', color || 16449540, false, ephemeral || true);
};

global.messageSuccess = async (interaction, body, color, ephemeral) => {
  const sentMessage = await client.functions.get('richEmbedMessage')
    .run(interaction, body, '', color || 4296754, false, ephemeral || false);
  return sentMessage;
};

global.reply = async (interaction, message) => {
  if (DEBUG) return interaction.editReply(message);
  return interaction.reply(message);
};

global.prettyCheck = (question) => {
  if (question) return '✅';
  return '❌';
};

module.exports.data = {
  name: 'globalFunc',
};
