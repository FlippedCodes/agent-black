const fs = require('fs');

module.exports.run = async (client, message, args, con, config) => {
  fs.readFile('./kiri-chat-bot/config/about.txt', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      message.channel.send('I\'m sorry, but something went wrong. We are working on it to fix it ^^');
      message.react('❌');
      return;
    }
    message.channel.send(data);
  });
};

module.exports.help = {
  name: 'about',
};
