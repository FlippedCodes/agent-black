const moment = require('moment');

const errHander = (err) => { console.error('ERROR:', err); };

// creates a embed messagetemplate for succeded actions
function messageSuccess(message, color, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', color, false);
}

// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete({ timeout: 10000 }));
}

function checkAllowed(DoB) {
  const age = moment().diff(DoB, 'years');
  return [age >= 18, age];
}

function calcMonths(DoB) {
  const fullAgeBD = moment(DoB).add(18, 'years');
  const monthDiff = moment(fullAgeBD).diff(moment(), 'months');
  return monthDiff;
}

module.exports.run = async (client, message, args, config, MessageEmbed, prefix) => {

};

module.exports.help = {
  name: 'CMD_addPunnishment_punnishsettings',
  parent: 'punnishsettings',
};
