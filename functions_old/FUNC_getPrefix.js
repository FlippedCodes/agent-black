const config = require('../config/main.json');

module.exports.run = async (message) => {
  // check if message is in guild
  if (message.channel.type !== 'text') return config.prefix.default;
  // get bot guild nickname
  const nickname = message.guild.me.displayName;
  // check nickname for last "|" > if not
  const spacer = config.prefix.nicknameSpacer;
  if (!nickname.includes(spacer)) return config.prefix.default;
  // parse prefix from nickname
  const customPrefix = nickname.substring(nickname.lastIndexOf(spacer) + spacer.length);
  // check if valid prefix
  if (customPrefix.includes(' ')) return config.prefix.default;
  // return prefix
  return customPrefix;
};

module.exports.help = {
  name: 'FUNC_getPrefix',
};
