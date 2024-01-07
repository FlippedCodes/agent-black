import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ban, banId } from './ban.js';
import type { guildsettings, guildsettingsId } from './guildsettings.js';

export interface guildAttributes {
  guildId: string;
  enabled: boolean;
  banned: boolean;
  settingsId: number;
}

export type guildPk = 'guildId';
export type guildId = guild[guildPk];
export type guildOptionalAttributes = 'enabled' | 'banned';
export type guildCreationAttributes = Optional<guildAttributes, guildOptionalAttributes>;

export class guild extends Model<guildAttributes, guildCreationAttributes> implements guildAttributes {
  //? Convert non null assertions to declare to prevent shadowing
  declare guildId: string;
  declare enabled: boolean;
  declare banned: boolean;
  declare settingsId: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  // guild hasMany ban via guildId
  declare bans: ban[];
  declare getBans: Sequelize.HasManyGetAssociationsMixin<ban>;
  declare setBans: Sequelize.HasManySetAssociationsMixin<ban, banId>;
  declare addBan: Sequelize.HasManyAddAssociationMixin<ban, banId>;
  declare addBans: Sequelize.HasManyAddAssociationsMixin<ban, banId>;
  declare createBan: Sequelize.HasManyCreateAssociationMixin<ban>;
  declare removeBan: Sequelize.HasManyRemoveAssociationMixin<ban, banId>;
  declare removeBans: Sequelize.HasManyRemoveAssociationsMixin<ban, banId>;
  declare hasBan: Sequelize.HasManyHasAssociationMixin<ban, banId>;
  declare hasBans: Sequelize.HasManyHasAssociationsMixin<ban, banId>;
  declare countBans: Sequelize.HasManyCountAssociationsMixin;
  // guild belongsTo guildsettings via settingsId
  declare setting: guildsettings;
  declare getSetting: Sequelize.BelongsToGetAssociationMixin<guildsettings>;
  declare setSetting: Sequelize.BelongsToSetAssociationMixin<guildsettings, guildsettingsId>;
  declare createSetting: Sequelize.BelongsToCreateAssociationMixin<guildsettings>;

  static initModel(sequelize: Sequelize.Sequelize): typeof guild {
    return guild.init(
      {
        guildId: {
          type: DataTypes.STRING(30),
          allowNull: false,
          primaryKey: true
        },
        enabled: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        banned: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        settingsId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'guildsettings',
            key: 'settingsId'
          }
        }
      },
      {
        sequelize,
        tableName: 'guild',
        timestamps: true,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'guildId' }]
          },
          {
            name: 'guild_fk_1',
            using: 'BTREE',
            fields: [{ name: 'settingsId' }]
          }
        ]
      }
    );
  }
}
