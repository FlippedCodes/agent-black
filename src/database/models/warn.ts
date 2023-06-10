import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { guild, guildId } from './guild.ts';

export interface warnAttributes {
  banId: number;
  guildId: string;
  targetId: string;
  reason: string;
  active: number;
  createdAt: Date;
  updatedAt: Date;
}

export type warnPk = 'banId';
export type warnId = warn[warnPk];
export type warnOptionalAttributes = 'active' | 'createdAt' | 'updatedAt';
export type warnCreationAttributes = Optional<warnAttributes, warnOptionalAttributes>;

export class warn extends Model<warnAttributes, warnCreationAttributes> implements warnAttributes {
  banId!: number;
  guildId!: string;
  targetId!: string;
  reason!: string;
  active!: number;
  createdAt!: Date;
  updatedAt!: Date;

  // warn belongsTo guild via guildId
  guild!: guild;
  getGuild!: Sequelize.BelongsToGetAssociationMixin<guild>;
  setGuild!: Sequelize.BelongsToSetAssociationMixin<guild, guildId>;
  createGuild!: Sequelize.BelongsToCreateAssociationMixin<guild>;

  static initModel(sequelize: Sequelize.Sequelize): typeof warn {
    return warn.init(
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
        tableName: 'warn',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'banId' }]
          },
          {
            name: 'warns_ibfk_1',
            using: 'BTREE',
            fields: [{ name: 'guildId' }]
          }
        ]
      }
    );
  }
}
