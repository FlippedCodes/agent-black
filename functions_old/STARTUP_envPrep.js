const testToken = './config/config.json';

module.exports.run = async (client, fs, config) => {
  // setting inDev var
  console.log(`[${module.exports.help.name}] Setting environment variables...`);
  if (fs.existsSync(testToken)) {
    const token = require(`.${testToken}`).token;
    config.env.set('inDev', true);
    config.env.set('token', token);
  } else {
    config.env.set('inDev', false);
    config.env.set('token', process.env.BotTokenAgentBlack);
  }
  console.log(`[${module.exports.help.name}] Environment variables set!`);
};

module.exports.help = {
  name: 'STARTUP_envPrep',
};
