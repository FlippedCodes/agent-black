import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { user, userId } from './user.ts';

export interface aliasAttributes {
  aliasId: number;
  user: string;
  alternative?: string;
  moderator: string;
  createdAt: Date;
  updatedAt: Date;
}

export type aliasPk = 'aliasId';
export type aliasId = alias[aliasPk];
export type aliasOptionalAttributes = 'aliasId' | 'createdAt' | 'updatedAt';
export type aliasCreationAttributes = Optional<
  aliasAttributes,
  aliasOptionalAttributes
>;

export class alias
  extends Model<aliasAttributes, aliasCreationAttributes>
  implements aliasAttributes
{
  aliasId!: number;
  user!: string;
  alternative!: string;
  moderator!: string;
  createdAt!: Date;
  updatedAt!: Date;

  // alias belongsTo user via moderator
  moderator_user!: user;
  getModerator_user!: Sequelize.BelongsToGetAssociationMixin<user>;
  setModerator_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createModerator_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof alias {
    return alias.init(
      {
        aliasId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        user: {
          type: DataTypes.CHAR(20),
          allowNull: false
        },
        alternative: {
          type: DataTypes.CHAR(20),
          allowNull: true,
          unique: 'alternative'
        },
        moderator: {
          type: DataTypes.CHAR(20),
          allowNull: false,
          references: {
            model: 'user',
            key: 'userId'
          }
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
        tableName: 'alias',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'aliasId' }]
          },
          {
            name: 'alternative',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'alternative' }]
          },
          {
            name: 'alias_ibfk_1',
            using: 'BTREE',
            fields: [{ name: 'moderator' }]
          }
        ]
      }
    );
  }
}
