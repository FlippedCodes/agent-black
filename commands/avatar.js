const { RichEmbed } = require('discord.js');

// creates a embed messagetemplate for failed actions
function messageFail(client, message, body) {
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false);
}

module.exports.run = async (client, message, args, config) => {
  const [userID] = args;

  // TODO: check if user is part of the team

  // check if user is charing a server
  if (!await client.functions.get('FUNC_checkID').run(userID, client, 'user')) {
    // TODO: when lookup is a function, retrieve pic from that
    messageFail(client, message, `The user with the ID \`${userID}\` doesn't share a server with this bot or doesn't exist. Running \`${config.prefix}lookup\` command for you.`);
    client.commands.get('lookup')
      .run(client, message, args, config);
    return;
  }

  const user = await client.users.find((user) => user.id === userID);

  if (!user.avatarURL) messageFail(client, message, 'This user doesn\'t have a profile picture');

  const embed = new RichEmbed().setImage(user.avatarURL);
  message.channel.send({ embed });
};

module.exports.help = {
  name: 'avatar',
  desc: 'Retrieves the profile picture of the provided user ID.',
};
