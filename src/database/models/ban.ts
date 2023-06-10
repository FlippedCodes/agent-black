import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { guild, guildId } from './guild.ts';

export interface banAttributes {
  banId: number;
  guildId: string;
  targetId: string;
  reason: string;
  active: number;
  createdAt: Date;
  updatedAt: Date;
}

export type banPk = 'banId';
export type banId = ban[banPk];
export type banOptionalAttributes = 'active' | 'createdAt' | 'updatedAt';
export type banCreationAttributes = Optional<banAttributes, banOptionalAttributes>;

export class ban extends Model<banAttributes, banCreationAttributes> implements banAttributes {
  banId!: number;
  guildId!: string;
  targetId!: string;
  reason!: string;
  active!: number;
  createdAt!: Date;
  updatedAt!: Date;

  // ban belongsTo guild via guildId
  guild!: guild;
  getGuild!: Sequelize.BelongsToGetAssociationMixin<guild>;
  setGuild!: Sequelize.BelongsToSetAssociationMixin<guild, guildId>;
  createGuild!: Sequelize.BelongsToCreateAssociationMixin<guild>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ban {
    return ban.init(
      {
        banId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        guildId: {
          type: DataTypes.CHAR(20),
          allowNull: false,
          references: {
            model: 'guild',
            key: 'guildId'
          }
        },
        targetId: {
          type: DataTypes.CHAR(20),
          allowNull: false
        },
        reason: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: 1
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
        tableName: 'ban',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'banId' }]
          },
          {
            name: 'bans_ibfk_1',
            using: 'BTREE',
            fields: [{ name: 'guildId' }]
          }
        ]
      }
    );
  }
}
