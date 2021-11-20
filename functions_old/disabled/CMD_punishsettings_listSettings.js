const { MessageEmbed } = require('discord.js');

const ServerSetting = require('../database/models/ServerSetting');

// gets server settings
async function getSettings(serverID) {
  const found = await ServerSetting.findOne({ where: { serverID } })
    .catch(errHandler);
  return found;
}

module.exports.run = async (client, message, args, config, prefix) => {
  const serverID = message.guild.id;
  const serverSettings = await getSettings(serverID);
  // prepare message
  const embed = new MessageEmbed()
    .setTitle('Punishment Settings')
    .addFields([
      {
        name: 'enable',
        value: serverSettings.pointsSystemEnabled,
        inline: true,
      },
      {
        name: 'forceReason',
        value: serverSettings.pointsSystemForceReason,
        inline: true,
      },
      {
        name: 'pointLifetime',
        value: serverSettings.pointLifetime,
        inline: true,
      },
    ]);
  // send it
  message.channel.send(embed);
};

module.exports.help = {
  name: 'CMD_punishsettings_listSettings',
  parent: 'punishsettings',
};
