const { MessageEmbed } = require('discord.js');

module.exports.run = async (interaction) => {
  // needs to be local as settings overlap from dofferent embed-requests
  const embed = new MessageEmbed();
  const command = interaction.options;
  // get user and ID
  const user = command.getUser('user', true);
  const forcedUser = await user.fetch(true);
  if (!forcedUser.banner) return messageFail(interaction, 'This user doesn\'t have a banner.');
  const pic = `https://cdn.discordapp.com/banners/${user.id}/${forcedUser.banner}?size=4096`;
  embed.setAuthor(user.tag, null, pic);
  embed.setImage(pic);

  reply(interaction, { embeds: [embed] });
};

module.exports.data = new CmdBuilder()
  .setName('banner')
  .setDescription('Retrieves the banner of a users profile via user ID.')
  .addUserOption((option) => option.setName('user').setDescription('Provide a user to get the bannner from.').setRequired(true));
