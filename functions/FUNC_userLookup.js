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
  let request = {
    method: 'GET',
    uri: `${uri}${userID}`,
    headers: {
      Authorization: `Bot ${tokenAPI}`,
    },
    json: true,
  };
  rp(request)
    .then((user) => {
      let creationDate = (user.id / 4194304) + 1420070400000;
      return {
        username: `${user.username}#${user.discriminator}`,
        joinDate: `${new Date(creationDate)}`,
        err: null,
      };
    })
    .catch((err) => [null, null, err]);
};

module.exports.help = {
  name: 'FUNC_userLookup',
};
