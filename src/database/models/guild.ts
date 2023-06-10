import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ban, banId } from './ban.ts';
import type { warn, warnId } from './warn.ts';

export interface guildAttributes {
  guildId: string;
  enabled: number;
  banned: number;
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
  guildId!: string;
  enabled!: number;
  banned!: number;
  settings!: guildSettings;
  createdAt!: Date;
  updatedAt!: Date;

  // guild hasMany ban via guildId
  bans!: ban[];
  getBans!: Sequelize.HasManyGetAssociationsMixin<ban>;
  setBans!: Sequelize.HasManySetAssociationsMixin<ban, banId>;
  addBan!: Sequelize.HasManyAddAssociationMixin<ban, banId>;
  addBans!: Sequelize.HasManyAddAssociationsMixin<ban, banId>;
  createBan!: Sequelize.HasManyCreateAssociationMixin<ban>;
  removeBan!: Sequelize.HasManyRemoveAssociationMixin<ban, banId>;
  removeBans!: Sequelize.HasManyRemoveAssociationsMixin<ban, banId>;
  hasBan!: Sequelize.HasManyHasAssociationMixin<ban, banId>;
  hasBans!: Sequelize.HasManyHasAssociationsMixin<ban, banId>;
  countBans!: Sequelize.HasManyCountAssociationsMixin;
  // guild hasMany warn via guildId
  warns!: warn[];
  getWarns!: Sequelize.HasManyGetAssociationsMixin<warn>;
  setWarns!: Sequelize.HasManySetAssociationsMixin<warn, warnId>;
  addWarn!: Sequelize.HasManyAddAssociationMixin<warn, warnId>;
  addWarns!: Sequelize.HasManyAddAssociationsMixin<warn, warnId>;
  createWarn!: Sequelize.HasManyCreateAssociationMixin<warn>;
  removeWarn!: Sequelize.HasManyRemoveAssociationMixin<warn, warnId>;
  removeWarns!: Sequelize.HasManyRemoveAssociationsMixin<warn, warnId>;
  hasWarn!: Sequelize.HasManyHasAssociationMixin<warn, warnId>;
  hasWarns!: Sequelize.HasManyHasAssociationsMixin<warn, warnId>;
  countWarns!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof guild {
    return guild.init(
      {
        guildId: {
          type: DataTypes.CHAR(20),
          allowNull: false,
          primaryKey: true
        },
        enabled: {
          type: DataTypes.TINYINT,
          allowNull: false,
          defaultValue: 0
        },
        banned: {
          type: DataTypes.TINYINT,
          allowNull: false,
          defaultValue: 0
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
