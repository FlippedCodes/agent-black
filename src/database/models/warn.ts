import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface warnAttributes {
  warnId: number;
  guildId: string;
  targetId: string;
  reason: string;
  readonly active: boolean;
}

export type warnPk = 'warnId';
export type warnId = warn[warnPk];
export type warnOptionalAttributes = 'warnId';
export type warnCreationAttributes = Optional<warnAttributes, warnOptionalAttributes>;

export class warn extends Model<warnAttributes, warnCreationAttributes> implements warnAttributes {
  //? Convert non null assertions to declare to prevent shadowing
  declare warnId: number;
  declare guildId: string;
  declare targetId: string;
  declare reason: string;
  declare readonly active: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof warn {
    return warn.init(
      {
        warnId: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        guildId: {
          type: DataTypes.STRING(30),
          allowNull: false
        },
        targetId: {
          type: DataTypes.STRING(30),
          allowNull: false
        },
        reason: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        active: {
          type: DataTypes.VIRTUAL,
          get() {
            return !this.isSoftDeleted();
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
            name: 'warns_index_1',
            using: 'BTREE',
            fields: [{ name: 'guildId' }]
          }
        ]
      }
    );
  }
}
