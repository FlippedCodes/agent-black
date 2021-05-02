// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete({ timeout: 10000 }));
}

// const description = 'To make this easy for everyone (me and you), we add the prefix to my Discord bots name:';
const desktop = `
1. Rightclick my name.
2. Click "Change Nickname"
3. Type what you want to call me, then add a \` | \` and after that your prefix.
    So it looks like something like this \`thebotthatgivespictures | f?\`
4. If you changed it, hit "Save" and you are done!`;
const mobile = `
1. Hold down on my name
2. Goto "Manage User"
3. Change the name at the top tp what you want to call me, then add a \` | \` and after that your prefix.
    So it looks like something like this \`thebotthatgivespictures | f?\`
4. Hit the save icon that shows up in the bottom right
5. Leave the menu and you are done!`;
const expain = 'I decided to dwo it thwis way, to save space on my database for other stwuff I cawnt store in Discord itself. Also thwis way eweryone can see the prefix.';

module.exports.run = async (client, message, args, config, MessageEmbed, messageOwner, fa_token_A, fa_token_B) => {
  // check if user can manage nicknames
  if (!message.member.hasPermission('MANAGE_NICKNAMES')) return messageFail(message, 'You dwon\'t hawe access to thwis command òwó');
  // post help text
  const embed = new MessageEmbed()
    .setAuthor('Howo two change the prefix:')
    .setColor(message.member.displayColor)
    // .setDescription(description)
    .addField('Desktop', desktop)
    .addField('Mobile', mobile)
    .addField('Hawing trowble?', `
      I've got you cowered.
      Join the halp serwer here: https://discord.gg/fMYD6XR
      `)
    .addField('Why thwis complicated!?', expain);
  message.channel.send({ embed });
};

module.exports.help = {
  name: 'prefix',
  title: 'Change prefix',
  desc: 'Howo two change the prefix.',
};
