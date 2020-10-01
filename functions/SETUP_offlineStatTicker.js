const startupTime = +new Date();

const OfflineStat = require('../database/models/OfflineStat');

const errHander = (err) => {
  console.error('ERROR:', err);
};

module.exports.run = async (client, config) => {
  setInterval(async () => {
    // loop db update in 5 sec intervall
    const [offlineStat] = await OfflineStat.findOrCreate({
      where: { ID: 1 }, defaults: { time: startupTime },
    }).catch(errHander);
    if (!offlineStat.isNewRecord) {
      OfflineStat.update({ time: +new Date() }, { where: { ID: 1 } }).catch(errHander);
    }
  }, 1 * 5000);
};

module.exports.help = {
  name: 'SETUP_offlineStatTicker',
};
