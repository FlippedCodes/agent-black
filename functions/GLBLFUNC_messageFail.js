global.messageFail = (message, body, keep) => module.exports.run(message, body, keep);

module.exports.run = async (message, body, keep) => {
  const client = message.client;
  const sentMessage = await client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false);
  if (!keep) sentMessage.delete({ timeout: 10000 });
  return sentMessage;
};

module.exports.help = {
  name: 'GLBLFUNC_messageFail',
};
