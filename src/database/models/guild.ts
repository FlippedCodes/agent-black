import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ban, banId } from './ban.js';
import type { warn, warnId } from './warn.js';

export interface guildAttributes {
  guildId: string;
  enabled: boolean;
  banned: boolean;
  settings: guildSettings;
  createdAt: Date;
  updatedAt: Date;
}

export type guildPk = 'guildId';
export type guildId = guild[guildPk];
export type guildOptionalAttributes = 'enabled' | 'banned' | 'createdAt' | 'updatedAt';
export type guildCreationAttributes = Optional<guildAttributes, guildOptionalAttributes>;
export type guildSettings = {
  channel: string;
  role: string;
};

export class guild extends Model<guildAttributes, guildCreationAttributes> implements guildAttributes {
  declare guildId: string;
  declare enabled: boolean;
  declare banned: boolean;
  declare settings: guildSettings;
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
  // guild hasMany warn via guildId
  declare warns: warn[];
  declare getWarns: Sequelize.HasManyGetAssociationsMixin<warn>;
  declare setWarns: Sequelize.HasManySetAssociationsMixin<warn, warnId>;
  declare addWarn: Sequelize.HasManyAddAssociationMixin<warn, warnId>;
  declare addWarns: Sequelize.HasManyAddAssociationsMixin<warn, warnId>;
  declare createWarn: Sequelize.HasManyCreateAssociationMixin<warn>;
  declare removeWarn: Sequelize.HasManyRemoveAssociationMixin<warn, warnId>;
  declare removeWarns: Sequelize.HasManyRemoveAssociationsMixin<warn, warnId>;
  declare hasWarn: Sequelize.HasManyHasAssociationMixin<warn, warnId>;
  declare hasWarns: Sequelize.HasManyHasAssociationsMixin<warn, warnId>;
  declare countWarns: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof guild {
    return guild.init(
      {
        guildId: {
          type: DataTypes.CHAR(20),
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
        settings: {
          type: DataTypes.JSON,
          allowNull: false
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
        }
      },
      {
        sequelize,
        tableName: 'guild',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'guildId' }]
          }
        ]
      }
    );
  }
}
