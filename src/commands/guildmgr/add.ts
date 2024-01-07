import { CmdFileArgs } from '../../typings/Extensions.js';

export const name = 'add';
export async function execute({ client, interaction, options }: CmdFileArgs): Promise<void> {
  // Options
  const guildId = options.getString('server', true);
  const channelId = options.getString('channel', true);
  const roleId = options.getString('role', true);
  // Try to find guild
  const guild = await client.guilds.fetch(guildId);
  if (!guild) {
    await interaction.editReply('Invalid argument: Guild not found');
    return;
  }
  // Try to find channel and role
  const channel = guild.channels.cache.get(channelId);
  const role = guild.roles.cache.get(roleId);
  if (!channel || !role) {
    await interaction.editReply('Invalid argument: Channel and/or role not found');
    return;
  }
  // Check if guild already exists
  const dbGuild = await client.models.guild.findOne({
    where: { guildId },
    include: [{ model: client.models.guildsettings, as: 'setting' }]
  });
  // If it does, update settings
  if (dbGuild) {
    dbGuild.setting.logChannel = channelId;
    dbGuild.setting.staffRole = roleId;
    await dbGuild.setting.save();
  } else {
    // Otherwise create settings
    await client.models.guildsettings
      .create({
        staffRole: roleId,
        logChannel: channelId
      })
      // And use that to create the guild entry
      .then((s) =>
        client.models.guild.create({
          guildId,
          settingsId: s.settingsId
        })
      )
      // Safely catch and log errors
      .catch((err) => client.logs.error({ err }));
  }
  // User reply
  await interaction.editReply({
    content: `Success! ${dbGuild !== null ? 'Updated' : 'Registered and created'} the settings for ${
      guild.name
    } (${guildId})!`
  });
  return;
}
