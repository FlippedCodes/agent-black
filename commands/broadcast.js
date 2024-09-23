const { MessageEmbed } = require('discord.js');

const ParticipatingServer = require('../database/models/ParticipatingServer');

function getChannels() {
  return ParticipatingServer.findAll({ where: { active: true, blocked: false }, attributes: ['logChannelID'] })
    .catch(ERR);
}

async function sendMessage(channel, author, body) {
    const embed = new MessageEmbed()
      .setAuthor({ name: `${author} broadcasted` })
      .setDescription(body)
      .setColor(4182379);
    channel.send({ embeds: [embed] });
}

module.exports.run = async (interaction) => {
  // check maintainer permissions
  if (!await client.functions.get('CHECK_DB_perms').run(interaction.user.id)) {
    messageFail(interaction, `You are not authorized to use \`/${module.exports.data.name}\``);
    return;
  }
  const body = interaction.options.getString('message', true).replaceAll('\\n', '\n');
  await messageSuccess(interaction, 'Sending messages...');
  const username = interaction.user.username;
  const avatarURL = interaction.user.avatarURL({ format: 'png', dynamic: true, size: 512 });
  const channels = await getChannels();
  channels.forEach(async (postChannel) => {
    const channel = client.channels.cache.get(postChannel.logChannelID);
    if (!channel) return console.log(`${postChannel.logChannelID} doesn't exist.`);
    let errCreateWebhook = false;
    const channelWebhooks = await channel.fetchWebhooks().catch((err) => {
      errCreateWebhook = true;
      return sendMessage(channel, interaction.user.tag, body);
    });
    if (errCreateWebhook) return;
    let hook = channelWebhooks.find((hook) => hook.owner.id === client.user.id);
    if (!hook) {
      hook = await channel.createWebhook(config.name).catch((err) => {
        errCreateWebhook = true;
        return sendMessage(channel, interaction.user.tag, body);
      });
    }
    if (errCreateWebhook) return;
    await hook.send({
      content: body, username, avatarURL,
    }).catch(ERR);
  });

  await messageSuccess(interaction, 'Sent messages to all servers!');
};

module.exports.data = new CmdBuilder()
  .setName('broadcast')
  .setDescription('Broadcasts a message to all servers.')
  .addStringOption((option) => option.setName('message').setDescription('Message that should be broadcasted').setRequired(true));
