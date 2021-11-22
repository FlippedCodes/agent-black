const { MessageEmbed } = require('discord.js');

module.exports.run = async (interaction) => {
  // needs to be local as settings overlap from dofferent embed-requests
  const embed = new MessageEmbed();
  const command = interaction.options;
  // get user and ID
  const user = command.getUser('user', true);
  const pfp = user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
  embed.setAuthor(user.tag, null, pfp);
  embed.setImage(pfp);

  reply(interaction, { embeds: [embed] });
};

module.exports.data = new CmdBuilder()
  .setName('avatar')
  .setDescription('Retrieves the profile picture of the provided user ID.')
  .addUserOption((option) => option.setName('user').setDescription('Provide a user to get the avatar from.').setRequired(true));
