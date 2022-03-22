const fs = require('fs');
const { messageFail } = require('../functions_old/GLBLFUNC_messageFail.js');
const { messageSuccess } = require('../functions_old/GLBLFUNC_messageSuccess.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require('discord.js');

module.exports.run = async (client, interaction) => {
  // eslint-disable-next-line no-undef
  fs.readFile(config.commands.about.text, 'utf8', (err, body) => {
    if (err) {
      messageFail(client, interaction, 'Something went wrong, try again another time!');
      throw err;
    }
    messageSuccess(interaction, body, null, true);
  });
};

module.exports.data = new SlashCommandBuilder()
  .setName('about')
  .setDescription('Displays some information about the bot.');
