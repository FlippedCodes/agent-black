import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface aliasAttributes {
  aliasId: number;
  user: string;
  alternative: string;
  moderator: string;
}

export type aliasPk = 'aliasId';
export type aliasId = alias[aliasPk];
export type aliasOptionalAttributes = 'aliasId';
export type aliasCreationAttributes = Optional<aliasAttributes, aliasOptionalAttributes>;

export class alias extends Model<aliasAttributes, aliasCreationAttributes> implements aliasAttributes {
  //? Convert non null assertions to declare to prevent shadowing
  declare aliasId: number;
  declare user: string;
  declare alternative: string;
  declare moderator: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof alias {
    return alias.init(
      {
        aliasId: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        user: {
          type: DataTypes.STRING(30),
          allowNull: false
        },
        alternative: {
          type: DataTypes.STRING(30),
          allowNull: false
        },
        moderator: {
          type: DataTypes.STRING(30),
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'alias',
        timestamps: true,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'aliasId' }]
          }
        ]
      }
    );
  }
}
