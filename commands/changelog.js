const fs = require('fs');

module.exports.run = async (interaction) => {
  fs.readFile(config.commands.changelog.text, 'utf8', (err, body) => {
    if (err) {
      ERR(err);
      messageFail(interaction, 'Something went wrong, try again another time!');
      return;
    }
    messageSuccess(interaction, body, null, true);
  });
};

module.exports.data = new CmdBuilder()
  .setName('changelog')
  .setDescription('Displays information about the most recent bot changes and what\'s to come.');
