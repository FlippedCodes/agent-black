const rp = require('request-promise');

const fs = require('fs');

const uri = 'https://discordapp.com/api/users/';

let tokenAPI;

if (fs.existsSync('./config/config.json')) {
  const api = require('../config/config.json');
  tokenAPI = api.token;
} else {
  tokenAPI = process.env.BotTokenAgentBlack;
}

module.exports.run = async (userID) => {
  let info;
  const request = {
    method: 'GET',
    uri: `${uri}${userID}`,
    headers: {
      Authorization: `Bot ${tokenAPI}`,
    },
    json: true,
  };
  // const user = await rp(request).catch((err) => info = [null, null, null, err]);
  const user = await rp(request).catch((err) => info = err);
  if (!info) {
    const creationDate = (user.id / 4194304) + 1420070400000;
    info = await {
      username: `${user.username}#${user.discriminator}`,
      creationDate: new Date(creationDate),
      avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`,
    };
  }
  return info;
};

module.exports.help = {
  name: 'FUNC_userLookup',
};
