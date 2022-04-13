const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const discardDeprecationWarning = require('../../database/models/discardDeprecationWarning');

const buttons = new MessageActionRow()
  .addComponents([
    new MessageButton()
      .setCustomId('discard')
      .setEmoji('✅')
      .setLabel('Don\'t show this again')
      .setStyle('PRIMARY'),
  ]);

const embed = (body) => new MessageEmbed()
  .setDescription(body)
  .setColor('RED');

async function addUser(userID) {
  const added = await discardDeprecationWarning.findOrCreate({ where: { userID } }).catch(ERR);
  const created = await added[1];
  return created;
}

async function checkUser(userID) {
  const user = await discardDeprecationWarning.findOne({ where: { userID } });
  return user;
}

module.exports.run = async (message) => {
  // debug protection
  if (DEBUG) return;
  // return if not prefix
  if (message.author.bot) return;
  if (!message.content.startsWith('a!')) return;

  const userID = message.author.id;

  if (await checkUser(userID)) return;

  const confirmMessage = await message.reply({ embeds: [embed('Hi there! I have been upgraded to Slash-Commands (v.3.0.0) and no longer support the old prefix of `a!` (Blame Discord). Please use the new `/` instead!')], components: [buttons], fetchReply: true });
  // For some reason that isnta-deletes the message?
  // await sentMessage.delete({ timeout: 20000 });
  // start button collector
  const filter = (i) => userID === i.user.id;
  const buttonCollector = confirmMessage.createMessageComponentCollector({ filter, time: 20000 });
  buttonCollector.on('collect', async (used) => {
    buttonCollector.stop();
    if (used.customId === 'discard') {
      await addUser(userID);
      confirmMessage.edit({ embeds: [embed('Message discarded and won\'t be shown again for you.')], components: [] });
      return;
    }
    return confirmMessage.edit({ embeds: [embed('Unknown response')], components: [] });
  });
  buttonCollector.on('end', async (collected) => {
    if (collected.size === 0) confirmMessage.edit({ embeds: [embed('Hi there! I have been upgraded to Slash-Commands (v.3.0.0) and no longer support the old prefix of `a!` (Blame Discord). Please use the new `/` instead!')], components: [] });
  });
};

module.exports.data = {
  name: 'messageCreate',
};
