import type { Sequelize } from 'sequelize';
import type { aliasAttributes, aliasCreationAttributes } from '../database/models/alias.js';
import { alias as _alias } from '../database/models/alias.js';
import type { banAttributes, banCreationAttributes } from '../database/models/ban.js';
import { ban as _ban } from '../database/models/ban.js';
import type { guildAttributes, guildCreationAttributes } from '../database/models/guild.js';
import { guild as _guild } from '../database/models/guild.js';
import type { userAttributes, userCreationAttributes } from '../database/models/user.js';
import { user as _user } from '../database/models/user.js';
import type { warnAttributes, warnCreationAttributes } from '../database/models/warn.js';
import { warn as _warn } from '../database/models/warn.js';

export { _alias as Alias, _ban as Ban, _guild as Guild, _user as User, _warn as Warn };

export type {
  aliasAttributes as AliasAttributes,
  aliasCreationAttributes as AliasCreationAttributes,
  banAttributes as BanAttributes,
  banCreationAttributes as BanCreationAttributes,
  guildAttributes as GuildAttributes,
  guildCreationAttributes as GuildCreationAttributes,
  userAttributes as UserAttributes,
  userCreationAttributes as UserCreationAttributes,
  warnAttributes as WarnAttributes,
  warnCreationAttributes as WarnCreationAttributes
};

export function initModels(sequelize: Sequelize) {
  const alias = _alias.initModel(sequelize);
  const ban = _ban.initModel(sequelize);
  const guild = _guild.initModel(sequelize);
  const user = _user.initModel(sequelize);
  const warn = _warn.initModel(sequelize);

  ban.belongsTo(guild, { as: 'guild', foreignKey: 'guildId' });
  guild.hasMany(ban, { as: 'bans', foreignKey: 'guildId' });
  warn.belongsTo(guild, { as: 'guild', foreignKey: 'guildId' });
  guild.hasMany(warn, { as: 'warns', foreignKey: 'guildId' });
  alias.belongsTo(user, { as: 'moderator_user', foreignKey: 'moderator' });
  user.hasMany(alias, { as: 'aliases', foreignKey: 'moderator' });

  return {
    alias,
    ban,
    guild,
    user,
    warn
  };
}
