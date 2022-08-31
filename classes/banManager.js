const { Guild, GuildBan } = require('discord.js');

const { Sequelize } = require('sequelize');

module.exports.BanManager = class BanManager {
  /**
   * @typedef {Object} ManagerData
   * @property {Array<GuildBan>} bans Array of bans
   * @property {Sequelize} sequelize Sequelize instance
   */
  /**
   * @param {ManagerData} data Data to initialize the manager with
   */
  constructor(data) {
    if (Array.isArray(data.bans) === false) throw new SyntaxError('Invalid bans array');
    this.bans = data.bans;
    if (!data.sequelize || data.sequelize instanceof Sequelize === false || !data.sequelize.models.Ban) throw new SyntaxError('Invalid Sequelize instance');
    this.sequelize = data.sequelize;
  }

  /**
   * @private
   * @description Adds a ban to the manager
   * @param {GuildBan} ban Ban to add to the manager
   * @returns {Promise<GuildBan>} Promise of the ban added
   */
  addBan(ban) {
    if (ban instanceof GuildBan === false) return Promise.reject(new SyntaxError('Invalid Ban instance'));
    return Promise.resolve(this.bans.push(ban));
  }

  /**
   * @description Adds multiple bans to the manager
   * @param {Guild} guild Guild to add bans from
   * @returns {Promise<Array<GuildBan>>} Array of bans added
   */
  addGuildBans(guild) {
    if (guild instanceof Guild === false) return Promise.reject(new SyntaxError('Invalid Guild instance'));
    return Promise.resolve(guild.bans.fetch().then((bans) => {
      if (bans instanceof Collection === false) return this.addBan(bans.first());
      return Array.from(bans.values()).forEach((ban) => this.addBan(ban));
    }));
  }

  /**
   * @description Syncs the manager with the database, adding bans that don't exist in the database
   * @returns {Promise<Array<GuildBan>>} Array of bans added
   */
  sync() {
    this.bans.forEach((ban) => {
      if (ban.user.bot && ban.user.fetchFlags().then((f) => f.has('VERIFIED_BOT'))) return; // Ignore verified bots
      this.sequelize.models.Ban.findOrCreate({
        where: {
          serverID: ban.guild.id,
          userID: ban.user.id,
          reason: ban.reason,
        },
        defaults: {
          // userID: ban.user.id,
          // serverID: ban.guild.id,
          userTag: ban.user.tag,
          // reason: ban.reason,
        },
      });
    })
      .then(() => Promise.resolve(this.bans), (err) => Promise.reject(err));
  }
};
