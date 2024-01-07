import { CustomClient } from '../../../typings/Extensions.js';

export const name = 'removeBans';
export async function execute(client: CustomClient, guildId: string) {
  // GDPR, remove all bans from the database
  await client.models.ban.destroy({
    where: {
      guildId
    },
    force: true
  });
  // Disable the guild
  await client.models.guild.update(
    {
      enabled: false
    },
    { where: { guildId } }
  );
}
