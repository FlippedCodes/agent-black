const { GuildBan } = require('discord.js');

const { Sequelize } = require('sequelize');

module.exports.alertManager = class alertManager {
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
   * @description Adds a ban to the manager
   * @param {GuildBan} ban Ban to add to the manager
   * @returns {Promise<GuildBan>} Promise of the ban added
   */
  addBan(ban) {
    if (ban instanceof GuildBan === false) return Promise.reject(new SyntaxError('Invalid Ban instance'));
    return Promise.resolve(this.bans.push(ban));
  }
};
