global.messageSuccess = async (message, body) => {
  const client = message.client;
  const sentMessage = await client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 4296754, false);
  return sentMessage;
};

module.exports.help = {
  name: 'GLBLFUNC_messageSuccess',
};
