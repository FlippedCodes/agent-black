global.messageSuccess = (message, body) => module.exports.run(message, body);

module.exports.run = async (message, body) => {
  const client = message.client;
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 4296754, false);
};

module.exports.help = {
  name: 'GLBLFUNC_messageSuccess',
};
