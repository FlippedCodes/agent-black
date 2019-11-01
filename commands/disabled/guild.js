const ParticipatingServer = require('../../database/models/ParticipatingServer');

module.exports.run = async (client, message, args, config) => {
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
