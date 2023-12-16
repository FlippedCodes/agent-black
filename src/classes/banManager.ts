import { Guild, GuildBan, PermissionFlagsBits, UserFlags } from 'discord.js';
import { Sequelize } from 'sequelize';
import { Ban } from '../typings/Models.js';

/**
 * @description Ban manager data
 */
type ManagerData = {
  /**
   * Array of bans
   */
  bans: GuildBan[];
  /**
   * Sequelize
   */
  sequelize: Sequelize;
};

class BanManager {
  declare bans: GuildBan[];
  declare sequelize: Sequelize;

  /**
   * @param {ManagerData} data Data to initialize the manager with
   */
  constructor(data: ManagerData) {
    this.bans = data.bans || [];
    if (data.sequelize instanceof Sequelize === false || !data.sequelize.models.ban)
      throw new SyntaxError('Invalid sequelize instance');
    this.sequelize = data.sequelize;
  }

  /**
   * @description Adds bans to the manager
   * @param {GuildBan[]} bans Bans to add to the manager
   * @returns {Promise<void>} Bans in the manager
   */
  add(bans: GuildBan[]): Promise<void> {
    if (bans instanceof GuildBan === false) return Promise.reject('Invalid Ban instance');
    this.bans.push(...bans);
    return;
  }

  /**
   * @async
   * @description Adds all bans from a guild to the manager
   * @param {Guild} guild Guild to add bans from
   * @param {boolean} [cache=false] Should the manager cache the bans
   * @returns {Promise<void>} Bans in the manager
   */
  async addGuild(guild: Guild, cache = false): Promise<void> {
    if (guild instanceof Guild === false) return Promise.reject('Invalid Guild instance');
    if (!guild.members.me.permissions.has(PermissionFlagsBits.BanMembers))
      return Promise.reject('Missing BanMembers in guild');
    const bans = await guild.bans.fetch({ cache });
    this.bans.push(...bans.values());
    return;
  }

  /**
   * @private
   * @description Removes invalid bans from the manager
   * @returns {void}
   */
  clean(): void {
    // If ban features a user or non verified bot, remove it
    this.bans = this.bans.filter(async (b) => !b.user.bot ?? (await b.user.fetchFlags()).has(UserFlags.VerifiedBot));
    return;
  }

  /**
   * @description Syncs the manager with the database, adding bans that don't exist in the database
   * @returns {Promise<PromiseSettledResult[]>} Result from Sequelize
   */
  sync(): Promise<PromiseSettledResult<[Ban, boolean]>[]> {
    this.clean(); // Clean bans
    const p: Promise<[Ban, boolean]>[] = [];
    for (const ban of this.bans) {
      p.push(
        this.sequelize.models.ban.findOrCreate({
          where: {
            guildId: ban.guild.id,
            targetId: ban.user.id,
            reason: String(ban.reason)
          }
        }) as Promise<[Ban, boolean]>
      );
    }
    return Promise.allSettled(p);
  }

  /**
   * @description Removes a ban from the manager
   * @param {GuildBan} ban Ban to remove from the manager
   * @returns {Promise<void>}
   */
  remove(ban: GuildBan): Promise<void> {
    if (ban instanceof GuildBan === false) return Promise.reject('Invalid Ban instance');
    this.bans.splice(this.bans.indexOf(ban), 1);
    return;
  }
}

export { BanManager };
