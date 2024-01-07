import type { Sequelize } from 'sequelize';
import type { aliasAttributes, aliasCreationAttributes } from '../database/models/alias.js';
import { alias as _alias } from '../database/models/alias.js';
import type { banAttributes, banCreationAttributes } from '../database/models/ban.js';
import { ban as _ban } from '../database/models/ban.js';
import type { guildAttributes, guildCreationAttributes } from '../database/models/guild.js';
import { guild as _guild } from '../database/models/guild.js';
import type { guildsettingsAttributes, guildsettingsCreationAttributes } from '../database/models/guildsettings.js';
import { guildsettings as _guildsettings } from '../database/models/guildsettings.js';
import type { userAttributes, userCreationAttributes } from '../database/models/user.js';
import { user as _user } from '../database/models/user.js';
import type { warnAttributes, warnCreationAttributes } from '../database/models/warn.js';
import { warn as _warn } from '../database/models/warn.js';

export { _alias as alias, _ban as ban, _guild as guild, _guildsettings as guildsettings, _user as user, _warn as warn };

export type {
  aliasAttributes,
  aliasCreationAttributes,
  banAttributes,
  banCreationAttributes,
  guildAttributes,
  guildCreationAttributes,
  guildsettingsAttributes,
  guildsettingsCreationAttributes,
  userAttributes,
  userCreationAttributes,
  warnAttributes,
  warnCreationAttributes
};

export function initModels(sequelize: Sequelize) {
  const alias = _alias.initModel(sequelize);
  const ban = _ban.initModel(sequelize);
  const guild = _guild.initModel(sequelize);
  const guildsettings = _guildsettings.initModel(sequelize);
  const user = _user.initModel(sequelize);
  const warn = _warn.initModel(sequelize);

  ban.belongsTo(guild, { as: 'guild', foreignKey: 'guildId' });
  guild.hasMany(ban, { as: 'bans', foreignKey: 'guildId' });
  guild.belongsTo(guildsettings, { as: 'setting', foreignKey: 'settingsId' });
  guildsettings.hasMany(guild, { as: 'guilds', foreignKey: 'settingsId' });

  return {
    alias: alias,
    ban: ban,
    guild: guild,
    guildsettings: guildsettings,
    user: user,
    warn: warn
  };
}
