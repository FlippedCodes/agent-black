import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { guild, guildId } from './guild.js';

export interface guildsettingsAttributes {
  settingsId: number;
  logChannel: string;
  staffRole: string;
  pointsSystemEnabled: number;
  pointsSystemForceReason: number;
  pointLifetime: string;
}

export type guildsettingsPk = 'settingsId';
export type guildsettingsId = guildsettings[guildsettingsPk];
export type guildsettingsOptionalAttributes =
  | 'settingsId'
  | 'pointsSystemEnabled'
  | 'pointsSystemForceReason'
  | 'pointLifetime';
export type guildsettingsCreationAttributes = Optional<guildsettingsAttributes, guildsettingsOptionalAttributes>;

export class guildsettings
  extends Model<guildsettingsAttributes, guildsettingsCreationAttributes>
  implements guildsettingsAttributes
{
  //? Convert non null assertions to declare to prevent shadowing
  declare settingsId: number;
  declare logChannel: string;
  declare staffRole: string;
  declare pointsSystemEnabled: number;
  declare pointsSystemForceReason: number;
  declare pointLifetime: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  // guildsettings hasMany guild via settingsId
  declare guilds: guild[];
  declare getGuilds: Sequelize.HasManyGetAssociationsMixin<guild>;
  declare setGuilds: Sequelize.HasManySetAssociationsMixin<guild, guildId>;
  declare addGuild: Sequelize.HasManyAddAssociationMixin<guild, guildId>;
  declare addGuilds: Sequelize.HasManyAddAssociationsMixin<guild, guildId>;
  declare createGuild: Sequelize.HasManyCreateAssociationMixin<guild>;
  declare removeGuild: Sequelize.HasManyRemoveAssociationMixin<guild, guildId>;
  declare removeGuilds: Sequelize.HasManyRemoveAssociationsMixin<guild, guildId>;
  declare hasGuild: Sequelize.HasManyHasAssociationMixin<guild, guildId>;
  declare hasGuilds: Sequelize.HasManyHasAssociationsMixin<guild, guildId>;
  declare countGuilds: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof guildsettings {
    return guildsettings.init(
      {
        settingsId: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        logChannel: {
          type: DataTypes.STRING(30),
          allowNull: false
        },
        staffRole: {
          type: DataTypes.STRING(30),
          allowNull: false
        },
        pointsSystemEnabled: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: 0
        },
        pointsSystemForceReason: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: 0
        },
        pointLifetime: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '1210000000'
        }
      },
      {
        sequelize,
        tableName: 'guildsettings',
        timestamps: true,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'settingsId' }]
          }
        ]
      }
    );
  }
}
