import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { guild, guildId } from './guild.js';

export interface banAttributes {
  banId: number;
  guildId: string;
  targetId: string;
  reason: string;
  active: boolean;
}

export type banPk = 'banId';
export type banId = ban[banPk];
export type banOptionalAttributes = banPk | 'active';
export type banCreationAttributes = Optional<banAttributes, banOptionalAttributes>;

export class ban extends Model<banAttributes, banCreationAttributes> implements banAttributes {
  declare banId: number;
  declare guildId: string;
  declare targetId: string;
  declare reason: string;
  declare active: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;

  // ban belongsTo guild via guildId
  declare guild: guild;
  declare getGuild: Sequelize.BelongsToGetAssociationMixin<guild>;
  declare setGuild: Sequelize.BelongsToSetAssociationMixin<guild, guildId>;
  declare createGuild: Sequelize.BelongsToCreateAssociationMixin<guild>;

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
          type: DataTypes.VIRTUAL,
          get() {
            return this.isSoftDeleted();
          }
        }
      },
      {
        sequelize,
        tableName: 'ban',
        timestamps: true,
        paranoid: true,
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
