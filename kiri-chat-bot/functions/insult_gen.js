module.exports.run = async (message) => {
  const Responses = [
    'fuck you',
    'eat my dick',
    'dont be a bitch',
    'eat shit',
  ];

  const randomChoice = Math.floor(Math.random() * Responses.length);
  message.channel.send(Responses[randomChoice]);
  message.react('❌');
};

module.exports.help = {
  name: 'insult_gen',
};
