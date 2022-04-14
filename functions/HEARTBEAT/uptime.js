// TODO: use vanilla implementation so not an entire packige is needed
const axios = require('axios');

const params = (pingRaw) => (
  {
    msg: 'OK',
    ping: Math.round(pingRaw),
  }
);

function sendHeartbeat() {
  axios.get(`${config.functions.heartbeat.uptime.endpoint}${process.env.token_uptime}`, { params: params(client.ws.ping) });
}

module.exports.run = async () => {
  setInterval(() => {
    sendHeartbeat();
  }, config.functions.heartbeat.uptime.interval);
};

module.exports.data = {
  name: 'uptime',
};
