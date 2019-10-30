const testToken = './config/test_token.json';

module.exports.run = async (client, fs, config) => {
  // setting inDev var
  if (fs.existsSync(testToken)) {
    const token = require(`.${testToken}`).token;
    config.env.set('inDev', true);
    config.env.set('token', token);
  } else {
    config.env.set('inDev', false);
    config.env.set('token', process.env.BotTokenAgentBlack);
  }
};

module.exports.help = {
  name: 'STARTUP_envPrep',
};
