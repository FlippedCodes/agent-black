module.exports.run = async (client, message, args, DB, config) => {
  if (!config.env.get('isTeam')) return message.react('❌');
  // TODO: Ask owner if command is needed, if solvable with discord native permission system
  message.channel.send('Command currently disabled as its in discussion with the owner.');
};

module.exports.help = {
  name: 'ripp',
};
