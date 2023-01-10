const { EmbedBuilder } = require('discord.js');

const ServerSetting = require('../../database/models/ServerSetting');

// gets server settings
async function getSettings(serverID) {
  const found = await ServerSetting.findOne({ where: { serverID } })
    .catch(ERR);
  return found;
}

module.exports.run = async (message, args, config, prefix) => {
  const serverID = message.guild.id;
  const serverSettings = await getSettings(serverID);
  // prepare message
  const embed = new EmbedBuilder()
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
