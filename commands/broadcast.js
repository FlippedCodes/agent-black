const ParticipatingServer = require('../database/models/ParticipatingServer');

function getChannels() {
  return ParticipatingServer.findAll({ attributes: ['logChannelID'] })
    .catch((err) => console.error(err));
}

async function sendMessages(client, message, body) {
  const channels = await getChannels();
  channels.forEach((channel) => {
    const channelID = channel.logChannelID;
    client.channels.find((channel) => channel.id === channelID);
  });
}

// creates a embed messagetemplate for failed actions
function messageFail(client, message, body) {
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false);
}

module.exports.run = async (client, message, args, config) => {
  const body = message.content.slice(config.prefix.length + module.exports.help.name.length + 1);
  if (!await client.functions.get('FUNC_checkUser').run(message.author.id)) {
    messageFail(client, message, `You are not authorized to use \`${config.prefix}${module.exports.help.name} ${body}\``);
    return;
  }
  sendMessages(client, message, body);
};

module.exports.help = {
  name: 'broadcast',
  usage: 'MESSAGE',
  desc: 'Broadcasts a message to all servers.',
};
