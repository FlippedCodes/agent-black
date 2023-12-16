import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { guild, guildId } from './guild.js';

export interface warnAttributes {
  warnId: number;
  guildId: string;
  targetId: string;
  reason: string;
  active: boolean;
}

export type warnPk = 'warnId';
export type warnId = warn[warnPk];
export type warnOptionalAttributes = warnPk;
export type warnCreationAttributes = Optional<warnAttributes, warnOptionalAttributes>;

export class warn extends Model<warnAttributes, warnCreationAttributes> implements warnAttributes {
  declare warnId: number;
  declare guildId: string;
  declare targetId: string;
  declare reason: string;
  declare active: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;

  // warn belongsTo guild via guildId
  declare guild: guild;
  declare getGuild: Sequelize.BelongsToGetAssociationMixin<guild>;
  declare setGuild: Sequelize.BelongsToSetAssociationMixin<guild, guildId>;
  declare createGuild: Sequelize.BelongsToCreateAssociationMixin<guild>;

  static initModel(sequelize: Sequelize.Sequelize): typeof warn {
    return warn.init(
      {
        warnId: {
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
        tableName: 'warn',
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'warnId' }]
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
