const { RichEmbed } = require('discord.js');

module.exports.run = async (client, message, args, DB, config) => {
  // prepare title and user CMDs
  let embed = new RichEmbed()
    .setTitle('Halp')
    .setColor(message.member.displayColor)
    .addField(
      `\`${config.prefix}help\``,
      'Shows this list of commands', true,
    );

  // post team/admin CMDs
  if (config.env.get('isTeam')) {
    embed
    // FIXME: No newline for first Teamcmd entry is made
      .addField(
        `\`${config.prefix}warn USER-ID|MENTION WARNLVL REASON\``,
        'Warn a user', true,
      )
      .addField(
        `\`${config.prefix}warndelete USER-ID|MENTION (REASON)\``,
        'Delete a userwaring competely', true,
      )
      .addField(
        `\`${config.prefix}accept USER-ID|MENTION (REASON)\``,
        'Moves user back down from uhohiaminshit to warning 3', true,
      )
      .addField(
        `\`${config.prefix}deny USER-ID|MENTION LENGTH (REASON)\``,
        'No description because the programmer was lazy', true,
      )
      .addField(
        `\`${config.prefix}ripp USER-ID|MENTION (REASON)\``,
        'User is unable to post any pictures for a week', true,
      );
  }

  // set footer
  embed
    .setFooter(message.client.user.tag, message.client.user.displayAvatarURL)
    .setTimestamp();
  message.channel.send({ embed });
  return;
};

module.exports.help = {
  name: 'help',
};
