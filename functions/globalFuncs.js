module.exports = {
  messageFail: async (client, interaction, body, color, ephemeral) => {
    const sentMessage = await client.functions.get('richEmbedMessage')
      .run(interaction, body, '', color || 16449540, false, ephemeral || true);
    return sentMessage;
  },
  messageSuccess: async (client, interaction, body, color, ephemeral) => {
    const sentMessage = await client.functions.get('richEmbedMessage')
      .run(interaction, body, '', color || 4296754, false, ephemeral || false);
    return sentMessage;
  },
  reply: (interaction, payload, followUp = false) => {
    if (followUp) return interaction.followUp(payload);
    // check if message needs to be edited or if its a first reply
    if (interaction.deferred || interaction.replied) return interaction.editReply(payload);
    return interaction.reply(payload);
  },
  prettyCheck: (question) => {
    if (question) return '✅';
    return '❌';
  },
  data: {
    name: 'globalFunc',
  }
};