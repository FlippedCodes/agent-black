const clean = (text) => {
  if (typeof (text) === 'string') {
    return text.replace(/`/g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`)
      .replace(process.env.DCtoken, '****NOPE****')
      .replace(process.env.DBpassword, '****NOPE****')
      .replace(process.env.DBhost, '****NOPE****')
      .replace(process.env.DBusername, '****NOPE****');
  }
  return text;
};

module.exports.run = async (interaction) => {
  // check owner permissions
  if (interaction.user.id !== '172031697355800577') return messageFail(interaction, `You are not authorized to use \`/${module.exports.data.name}\``, null, false);
  const code = interaction.options.getString('codeline', true);
  try {
    let evaled = eval(code);

    if (typeof evaled !== 'string') { evaled = require('util').inspect(evaled); }

    messageSuccess(interaction, `\`\`\`xl\n${clean(evaled)}\n\`\`\``, null, true);
  } catch (err) { messageFail(interaction, `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``); }
};

module.exports.data = new CmdBuilder()
  .setName('eval')
  .setDescription('Command used to run snippets of code. [OWNER ONLY].')
  .addStringOption((option) => option.setName('codeline').setDescription('Commandline to execute').setRequired(true));
