const fs = require('fs');

module.exports.run = async (interaction) => {
  fs.readFile(config.commands.about.text, 'utf8', (err, body) => {
    if (err) {
      ERR(err);
      messageFail(interaction, 'Something went wrong, try again another time!');
      return;
    }
    messageSuccess(interaction, body, null, true);
  });
};

module.exports.data = new CmdBuilder()
  .setName('about')
  .setDescription('Displays some information about the bot.');
