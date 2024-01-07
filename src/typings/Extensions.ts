import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { Logger } from 'pino';
import { Sequelize } from 'sequelize';
import { initModels } from './Models.js';

export interface CustomClient<Ready extends boolean = boolean> extends Client {
  /** @desc Commands for the bot to handle */
  commands?: Map<string, CommandFile>;
  /** @desc Functions dynamically imported */
  functions?: Map<string, FunctionFile>;
  /** @desc Sequelize instance */
  sequelize?: Sequelize;
  /** @desc Sequelize models for the database */
  models?: ReturnType<typeof initModels>;
  /** @desc Whether the bot is ready to accept commands */
  ready?: boolean;
  /** @desc Logging ({@link Ready} determines type: true is {@link Logger}, false is {@link Console}) */
  logs?: Ready extends true ? Logger : Console;
}
// Various types of file that will be imported
export interface CommandFile {
  name?: string;
  ephemeral?: boolean;
  data?: SlashCommandBuilder;
  execute: ({ client, interaction, options }: CmdFileArgs) => Promise<void>;
}
export interface FunctionFile {
  name: string;
  execute: (client: CustomClient, ...args: unknown[]) => Promise<unknown>;
}

export enum FlagEmoji {
  ActiveDeveloper = '<:DB_ActiveDeveloper:1118377588063227964>',
  BugHunterLevel1 = '<:DB_BugHunterL1:1118377590521081908>',
  BugHunterLevel2 = '<:DB_BugHunterL2:1118377591754194988>',
  CertifiedModerator = '<:DB_ModeratorProgramAlumni:1118377602671972424>',
  Hypesquad = '<:DB_HypesquadEvents:1118377600876822590>',
  HypeSquadOnlineHouse1 = '<:DB_HypesquadBravery:1118377597823365191>',
  HypeSquadOnlineHouse2 = '<:DB_HypesquadBrilliance:1118377599702401126>',
  HypeSquadOnlineHouse3 = '<:DB_HypesquadBalance:1118377596640567366>',
  Nitro = '<:DB_Nitro:1118377784310509578>',
  Quarantined = '<:DB_Quarantine:1118377861984813177>',
  Spammer = '<:DB_Spammer:1118377609030533160>',
  Staff = '<:DB_Staff:1118377789716955176>',
  Partner = '<:DB_Partner:1118377786478960711>',
  Pomelo = '<:DB_Pomelo:1118377605935140934>',
  PremiumEarlySupporter = '<:DB_EarlySupporter:1118377593176076378>',
  VerifiedBot = '<:DB_VerifiedBot:1118377792652980224>',
  VerifiedDeveloper = '<:DB_VerifiedDeveloper:1118377595277418576>'
}
/** @desc Messages to be sent to the masterMessage function */
export enum BroadcastType {
  /** @desc Broadcast from Maintainer+ */
  Broadcast = 0x6699ff,
  /** @desc User banned alert */
  UserBanned = 0xff0000,
  /** @desc User warned alert */
  UserWarned = 0xff9933,
  /** @desc Maintenance warning */
  Maintenance = 0x77b300,
  /** @desc Security alert */
  SecurityAlert = 0xff00ff,
  /** @desc Other - All servers */
  Other = 0xffffff
}

export type CmdFileArgs = {
  client: CustomClient<true>;
  interaction: ChatInputCommandInteraction;
  options: ChatInputCommandInteraction['options'];
};
