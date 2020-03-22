const { RichEmbed } = require('discord.js');

// creates a embed messagetemplate for failed actions
function messageFail(client, message, body) {
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false);
}

module.exports.run = async (client, message, args, config) => {
  let [userID] = args;
  if (!userID) userID = message.author.id;

  const embed = new RichEmbed().setColor(message.member.displayColor);
  const discordMember = await client.fetchUser(userID, false)
    .catch((err) => {
      if (err.code === 10013) embed.setAuthor('This user doesn\'t exist.');
      else embed.setAuthor('An error occurred!');
      embed.addField('Stopcode', err.message);
      return message.channel.send({ embed });
    });

  if (discordMember.avatarURL) embed.setImage(discordMember.avatarURL);
  else embed.setImage('https://cdn.discordapp.com/embed/avatars/4.png');
  message.channel.send({ embed });
};

module.exports.help = {
  name: 'avatar',
  usage: 'USERID',
  desc: 'Retrieves the profile picture of the provided user ID.',
};
