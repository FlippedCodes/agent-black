// TODO: use vanilla implementation so not an entire packige is needed
const axios = require('axios');

const params = (pingRaw) => (
  {
    status: 'up',
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
  }, config.functions.heartbeat.uptime.interval * 1000);
};

module.exports.data = {
  name: 'uptime',
};
