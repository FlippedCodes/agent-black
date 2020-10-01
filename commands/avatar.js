const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, config) => {
  let [userID] = args;
  if (!userID) userID = message.author.id;

  const embed = new MessageEmbed().setColor(message.member.displayColor);
  const discordUser = await client.users.fetch(userID, false)
    .catch((err) => {
      if (err.code === 10013) embed.setAuthor('This user doesn\'t exist.');
      else embed.setAuthor('An error occurred!');
      embed.addField('Stopcode', err.message);
    });

  if (discordUser) {
    const pfp = discordUser.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
    embed.setAuthor(discordUser.tag, null, pfp);
    embed.setImage(pfp);
  }

  message.channel.send({ embed });
};

module.exports.help = {
  name: 'avatar',
  title: 'Get Avatar',
  usage: 'USERID',
  desc: 'Retrieves the profile picture of the provided user ID.',
};
