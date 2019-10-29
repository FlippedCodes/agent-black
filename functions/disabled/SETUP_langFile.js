const Handlebars = require('handlebars');

const lang = require('../config/lang.json');

function configToTemplate(lang) {
  if (typeof lang === 'string') return Handlebars.compile(lang);
  const result = {};
  let key;
  let value;
  // eslint-disable-next-line no-restricted-syntax
  for ([key, value] of Object.entries(lang)) {
    result[key] = configToTemplate(value);
  }
  return result;
}

module.exports.run = async () => configToTemplate(lang);

module.exports.help = {
  name: 'SETUP_langFile',
};
