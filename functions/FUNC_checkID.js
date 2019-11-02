module.exports.run = async (ID, client, type) => {
  let existingID = false;

  switch (type) {
    case 'server':
      if (client.guilds.find((server) => server.id === ID)) existingID = true;
      return existingID;

    case 'user':
      if (client.users.find((user) => user.id === ID)) existingID = true;
      return existingID;

    case 'channel':
      if (client.channels.find((channel) => channel.id === ID)) existingID = true;
      return existingID;

    default:
      return null;
  }
};

module.exports.help = {
  name: 'FUNC_checkID',
};
