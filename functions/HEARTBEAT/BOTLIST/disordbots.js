const axios = require('axios');

function sendHeartbeat() {
  axios({
    method: 'post',
    url: `${config.functions.heartbeat.discordbotlist.endpoint}${client.id}/stats`,
    headers: {
      Authorization: process.env.token_discordbots,
      'Content-Type': 'application/json',
      'User-Agent': `FurExplicitBot/${config.package.version} by Phil | Flipper#3621 on Discord`,
    },
    data: { guildCount: client.guilds.cache.size },
  });
}

module.exports.run = async () => {
  setInterval(() => {
    sendHeartbeat();
  }, config.functions.heartbeat.discordbotlist.interval);
};

module.exports.data = {
  name: 'disordbots',
};
