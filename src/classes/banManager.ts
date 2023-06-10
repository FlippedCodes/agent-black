import { Guild, GuildBan, PermissionFlagsBits, UserFlags } from 'discord.js';
import { Model, Sequelize } from 'sequelize';

/**
 * @description Ban manager data
 */
type ManagerData = {
  /**
   * Array of bans
   */
  bans: GuildBan[];
  /**
   * Sequelize instance
   */
  sequelize: Sequelize;
};

class BanManager {
  /**
   * @type {GuildBan[]} Array of bans
   */
  bans: GuildBan[] = [];
  /**
   * @type {Sequelize} Sequelize instance
   */
  sequelize: Sequelize;

  /**
   * @param {ManagerData} data Data to initialize the manager with
   */
  constructor(data: ManagerData) {
    this.bans = data.bans;
    if (!data.sequelize || data.sequelize instanceof Sequelize === false)
      throw new SyntaxError('Invalid Sequelize instance');
    this.sequelize = data.sequelize;
  }

  /**
   * @description Adds bans to the manager
   * @param {GuildBan[]} bans Bans to add to the manager
   * @returns {Promise<GuildBan[]>} Bans in the manager
   */
  add(bans: GuildBan[]): Promise<GuildBan[]> {
    if (bans instanceof GuildBan === false) return Promise.reject('Invalid Ban instance');
    this.bans.push(...bans);
    return Promise.resolve(this.bans);
  }

  /**
   * @async
   * @description Adds all bans from a guild to the manager
   * @param {Guild} guild Guild to add bans from
   * @param {boolean} [cache=false] Should the manager cache the bans
   * @returns {Promise<GuildBan[]>} Bans in the manager
   */
  async addGuildBans(guild: Guild, cache = false): Promise<GuildBan[]> {
    if (guild instanceof Guild === false) return Promise.reject('Invalid Guild instance');
    if (!guild.members.me?.permissions.has(PermissionFlagsBits.BanMembers))
      return Promise.reject('Missing BanMembers in guild');
    const bans = await guild.bans.fetch({ cache });
    this.bans.push(...bans.values());
    return Promise.resolve(this.bans);
  }

  /**
   * @private
   * @description Removes invalid bans from the manager
   * @returns {Promise<GuildBan[]>} Bans in the manager
   */
  clean(): Promise<GuildBan[]> {
    this.bans.forEach(async (ban) => {
      if (ban.user.bot && (await ban.user.fetchFlags().then((f) => f.has(UserFlags.VerifiedBot)))) this.remove(ban);
    });
    return Promise.resolve(this.bans);
  }

  /**
   * @description Syncs the manager with the database, adding bans that don't exist in the database
   * @returns {Promise<PromiseSettledResult[]>} Result from Sequelize
   */
  sync(): Promise<PromiseSettledResult<[Model, boolean]>[]> {
    this.clean(); // Clean bans
    const p: Promise<[Model, boolean]>[] = [];
    this.bans.forEach((ban) => {
      p.push(
        this.sequelize.models.Ban.findOrCreate({
          where: {
            serverID: ban.guild.id,
            userID: ban.user.id,
            reason: ban.reason
          },
          defaults: {
            // userID: ban.user.id,
            // serverID: ban.guild.id,
            userTag: ban.user.tag
            // reason: ban.reason,
          }
        })
      );
    });
    return Promise.allSettled(p);
  }

  /**
   * @description Removes a ban from the manager
   * @param {GuildBan} ban Ban to remove from the manager
   * @returns {Promise<GuildBan[]>} Bans in the manager
   */
  remove(ban: GuildBan): Promise<GuildBan[]> {
    if (ban instanceof GuildBan === false) return Promise.reject('Invalid Ban instance');
    this.bans.splice(this.bans.indexOf(ban), 1);
    return Promise.resolve(this.bans);
  }
}

export { BanManager };
