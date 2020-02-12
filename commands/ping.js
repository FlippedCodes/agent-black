const { RichEmbed } = require('discord.js');

// Ping kickoff for bot latency
function kickoff(client, message) {
  const sendMessage = client.functions.get('FUNC_richEmbedMessage');
  return sendMessage.run(client.user, message.channel, '📤 Ping...', null, null, false);
}

// message for data return
function editedMessage(sentMessage, message) {
  let api_latency = Math.round(sentMessage.client.ping);
  let body = `📥 Pong!
  Latency is \`${sentMessage.createdTimestamp - message.createdTimestamp}\`ms.
  API Latency is \`${api_latency}\`ms`;
  return new RichEmbed()
    .setDescription(body)
    .setColor();
}

// posts ping message and edits it afterwards
function checkPing(client, message) {
  kickoff(client, message).then((sentMessage) => {
    sentMessage.edit(editedMessage(sentMessage, message));
  });
}

module.exports.run = async (client, message) => checkPing(client, message);

module.exports.help = {
  name: 'ping',
  desc: 'Shows API and bot latencies.',
};
