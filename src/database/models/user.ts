import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { StaffFlagsBitField } from '../../typings/Bitfield.js';

export interface userAttributes {
  userId: string;
  flags: StaffFlagsBitField;
}

export type userPk = 'userId';
export type userId = user[userPk];
export type userOptionalAttributes = 'flags';
export type userCreationAttributes = Optional<userAttributes, userOptionalAttributes>;

export class user extends Model<userAttributes, userCreationAttributes> implements userAttributes {
  //? Convert non null assertions to declare to prevent shadowing
  declare userId: string;
  declare flags: StaffFlagsBitField;
  declare createdAt: Date;
  declare updatedAt: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof user {
    return user.init(
      {
        userId: {
          type: DataTypes.CHAR(30),
          allowNull: false,
          primaryKey: true
        },
        flags: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          get() {
            const f = BigInt(this.getDataValue('flags') as unknown as number);
            return new StaffFlagsBitField(f);
          },
          set(val: StaffFlagsBitField) {
            // @ts-expect-error Intentional assignment
            this.setDataValue('flags', val.bitfield);
          }
        }
      },
      {
        sequelize,
        tableName: 'user',
        timestamps: true,
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
