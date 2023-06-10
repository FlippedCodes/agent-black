import { Client, Collection, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Alias, Ban, Guild, User, Warn } from './Models.ts';
import { Sequelize } from 'sequelize';
import Logger from 'bunyan';

export interface CustomClient extends Client {
  env?: { [key: string]: string };
  commands?: Collection<string, SlashCommandFile>;
  functions?: Collection<string, FunctionFile>;
  sequelize?: Sequelize;
  models?: {
    Alias: typeof Alias;
    Ban: typeof Ban;
    Guild: typeof Guild;
    User: typeof User;
    Warn: typeof Warn;
  };
  stdrr?: Logger;
}

export interface SlashCommandFile {
  name: string;
  data: SlashCommandBuilder;
  run: (client: Client, interaction: CommandInteraction, options: CommandInteraction['options']) => Promise<void>;
}

export interface FunctionFile {
  name: string;
  run: (...args: unknown[]) => Promise<void>;
}
