const ParticipatingServer = require('../database/models/ParticipatingServer');

module.exports.run = async (client, message, args, config) => {
  // check if server is in list of participating servers
  const server = client.functions.get('FUNC_checkServer').run(message.channel.guild.id);
  if (!server) return message.react('❌');

  let [subcmd, ID, name] = args;

  switch (subcmd) {
    case 'add':

      return;

    case 'remove':

      return;

    case 'info':

      return;

    default:
      client.functions.get('FUNC_invalidCMD').run(message, subcmd)
        .catch((err) => console.error(err));
      return;
  }
};

module.exports.help = {
  name: 'guild',
};
