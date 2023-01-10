const { EmbedBuilder } = require('discord.js');

const ParticipatingServer = require('../database/models/ParticipatingServer');

function getChannels() {
  return ParticipatingServer.findAll({ where: { active: true, blocked: false }, attributes: ['logChannelID'] })
    .catch(ERR);
}

async function sendMessage(author, body) {
  const channels = await getChannels();
  channels.forEach((DBchannel) => {
    const channelID = DBchannel.logChannelID;
    const channel = client.channels.cache.find((channel) => channel.id === channelID);
    const embed = new EmbedBuilder()
      .setAuthor({ name: `${author} broadcasted` })
      .setDescription(body)
      .setColor(4182379);
    channel.send({ embeds: [embed] });
  });
}

module.exports.run = async (interaction) => {
  // check maintainer permissions
  if (!await client.functions.get('CHECK_DB_perms').run(interaction.user.id)) {
    messageFail(interaction, `You are not authorized to use \`/${module.exports.data.name}\``);
    return;
  }
  const body = interaction.options.getString('message', true);
  await messageSuccess(interaction, 'Sending messages...');
  await sendMessage(interaction.user.tag, body.replaceAll('\\n', `
  `));
  await messageSuccess(interaction, 'Sent messages to all servers!');
};

module.exports.data = new CmdBuilder()
  .setName('broadcast')
  .setDescription('Broadcasts a message to all servers.')
  .addStringOption((option) => option.setName('message').setDescription('Message that should be broadcasted').setRequired(true));
