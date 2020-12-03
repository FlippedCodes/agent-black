global.messageFail = (message, body) => module.exports.run(message, body);

module.exports.run = async (message, body) => {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete({ timeout: 10000 }));
};

module.exports.help = {
  name: 'GLBLFUNC_messageFail',
};
