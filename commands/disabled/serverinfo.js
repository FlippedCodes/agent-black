const { RichEmbed } = require('discord.js');

module.exports.run = async (client, message, args, con, config) => {
  let pic = 'https://pbs.twimg.com/profile_images/715852271389655041/s-VdeDI5_400x400.jpg';
  if (message.guild.iconURL) pic = message.guild.iconURL;

  message.guild.fetchMember(userID)
    .then((member) => {
      let embed = new RichEmbed()
        .setColor(member.displayColor)
        .setImage(member.user.avatarURL);
      message.channel.send({ embed });
    });

  const embed = {
    color: message.member.displayColor,
    timestamp: new Date(),
    author: {
      name: message.guild.name,
    },
    footer: {
      icon_url: message.client.user.displayAvatarURL,
      text: message.client.user.tag,
    },
    fields: [
      {
        name: 'Server created on',
        value: `${message.guild.createdAt.toLocaleDateString()} ${message.guild.createdAt.toLocaleTimeString()}`,
        inline: true,
      },
      {
        name: 'Acronym',
        value: message.guild.nameAcronym,
        inline: true,
      },
      {
        name: 'Name',
        value: message.guild.name,
        inline: true,
      },
      {
        name: 'Owner',
        value: message.guild.owner.user.tag,
        inline: true,
      },
      {
        name: 'ID',
        value: message.guild.id,
        inline: true,
      },
      {
        name: 'Channels',
        value: message.guild.channels.size,
        inline: true,
      },
      {
        name: 'Emojis',
        value: message.guild.emojis.size,
        inline: true,
      },
      {
        name: 'Membercount',
        value: message.guild.memberCount,
        inline: true,
      },
      {
        name: 'Member online',
        value: message.guild.presences.size,
        inline: true,
      },
      {
        name: 'Verification level',
        value: message.guild.verificationLevel,
        inline: true,
      },
      {
        name: 'Content filter',
        value: message.guild.explicitContentFilter,
        inline: true,
      },
      {
        name: 'Region',
        value: message.guild.region,
        inline: true,
      },
      {
        name: 'Server Icon',
        value: pic,
      },
    ],
    image: {
      url: pic,
    },
  };

  message.channel.send({ embed });
};

module.exports.help = {
  name: 'serverinfo',
  desc: 'Displays serverinfo from the provided server ID',
};
