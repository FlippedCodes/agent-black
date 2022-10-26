const { Guild, GuildBan } = require('discord.js');

const { UserFlags, PermissionFlagsBits } = require('discord-api-types/v10');

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
    if (data.bans !== undefined && Array.isArray(data.bans) === false) throw new SyntaxError('Invalid bans array');
    this.bans = data.bans || [];
    if (!data.sequelize || data.sequelize instanceof Sequelize === false || !data.sequelize.models.Ban) throw new SyntaxError('Invalid Sequelize instance');
    this.sequelize = data.sequelize;
  }

  /**
   * @description Adds one or more bans to the manager
   * @param {Array<GuildBan>|GuildBan} bans Bans to add to the manager
   * @returns {Promise<Array<GuildBan>>} Promise of the bans added
   */
  addBans(bans) {
    this.bans.push(bans);
    return Promise.resolve(this.validateBans());
  }

  /**
   * @description Adds multiple bans to the manager
   * @param {Guild} guild Guild to add bans from
   * @returns {Promise<Array<GuildBan>>} Array of bans added
   */
  async addGuildBans(guild) {
    if (guild instanceof Guild === false) return Promise.reject(new SyntaxError('Invalid Guild instance'));
    if (!guild.me.permissions.has(PermissionFlagsBits.BanMembers)) return Promise.reject(new SyntaxError('Missing BanMembers in guild'));
    const bans = await guild.bans.fetch();
    if (bans instanceof Collection === false) return this.addBans(bans);
    return this.addBans(Array.from(bans.values()));
  }

  /**
   * @description Syncs the manager with the database, adding bans that don't exist in the database
   * @returns {Promise<Array<GuildBan>>} Array of bans added
   */
  sync() {
    this.bans.forEach((ban) => {
      this.sequelize.models.Ban.upsert({
        serverID: ban.guild.id,
        userID: ban.user.id,
        reason: ban.reason,
        userTag: ban.user.tag,
      }).catch((err) => Promise.reject(err));
    });
    Promise.resolve(this.bans);
  }

  /**
   * @private
   * @description Validates and verifies all bans in the ban manager
   */
  validateBans() {
    let valid = [];
    if (!Array.isArray(this.bans)) this.bans = [];
    valid = this.bans.filter((ban) => ban instanceof GuildBan);
    valid = valid.filter((ban) => ban.user.bot && ban.user.fetchFlags().then((f) => f.has(UserFlags.VerifiedBot)));
    return Promise.resolve(this.bans = valid);
  }
};
