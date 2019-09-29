const clean = (text) => {
  if (typeof (text) === 'string') { return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`); }
  return text;
};

module.exports.run = async (client, message, args, con, config) => {
  const args_eval = message.content.split(' ').slice(1);
  if (message.author.id !== '172031697355800577') return message.react('❌');
  if (message.content.indexOf('token.token' || 'process.env.BOT_TOKEN' || 'token') !== -1) return message.channel.send('Do you think its that easy?\nSry, but cant give you my key...');
  try {
    const code = args_eval.join(' ');
    let evaled = eval(code);

    if (typeof evaled !== 'string') { evaled = require('util').inspect(evaled); }

    message.channel.send(clean(evaled), { code: 'xl' });
  } catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``)
      .then(message.react('❌'));
  }
};

module.exports.help = {
  name: 'eval',
};
