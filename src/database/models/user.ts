import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface userAttributes {
  userId: string;
  flags: number;
  createdAt: Date;
  updatedAt: Date;
}

export type userPk = 'userId';
export type userId = user[userPk];
export type userOptionalAttributes = 'flags' | 'createdAt' | 'updatedAt';
export type userCreationAttributes = Optional<userAttributes, userOptionalAttributes>;

export class user extends Model<userAttributes, userCreationAttributes> implements userAttributes {
  userId!: string;
  flags!: number;
  createdAt!: Date;
  updatedAt!: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof user {
    return user.init(
      {
        userId: {
          type: DataTypes.CHAR(20),
          allowNull: false,
          primaryKey: true
        },
        flags: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
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
        tableName: 'user',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'userId' }]
          }
        ]
      }
    );
  }
}
