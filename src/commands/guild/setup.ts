import { CmdFileArgs } from '../../typings/Extensions.js';

export const name = 'setup';
export async function execute({ client, interaction, options }: CmdFileArgs): Promise<void> {
  const existingGuild = await client.models.guild.findOne({
    where: {
      guildId: interaction.guildId
    },
    include: [{ model: client.models.guildsettings, as: 'setting' }]
  });
  // Update the database if it exists
  if (existingGuild) {
    existingGuild.setting.staffRole = options.getRole('staff_role').id;
    existingGuild.setting.logChannel = options.getChannel('staff_channel').id;
    await existingGuild.setting.save();
  } else {
    // Create guild settings first
    await client.models.guildsettings
      .create({
        staffRole: options.getRole('staff_role').id,
        logChannel: options.getChannel('staff_channel').id
      })
      // And use that to create the guild entry
      .then((s) =>
        client.models.guild.create({
          guildId: interaction.guildId,
          settingsId: s.settingsId,
          enabled: true
        })
      )
      // Safely catch and log errors
      .catch((err) => client.logs.error({ err }));
  }
  // User reply
  interaction.editReply({
    content: `Success! ${existingGuild !== null ? 'Updated' : 'Registered and created'} the settings for this server!`
  });
  return;
}
