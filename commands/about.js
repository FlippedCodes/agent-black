const fs = require('fs');

// creates a embed messagetemplate for failed text retrieving and posts error message into log
function error(err, interaction) {
  ERR(err);
  messageFail(interaction, 'Something went wrong, try again another time!');
}

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
