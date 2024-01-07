import { CustomClient } from '../../typings/Extensions.js';
import { existsSync, mkdirSync, createWriteStream } from 'node:fs';
import { stdSerializers, pino } from 'pino';

export const name = 'pino';
export async function execute(client: CustomClient, _ready: boolean): Promise<void> {
  // Create logs directory at TLD if it doesn't exist
  if (!existsSync('../logs')) mkdirSync('../logs');
  // Overwrite console logger with pino
  client.logs = pino(
    {
      name: 'main',
      // Warn if production, trace if development
      level: process.env.NODE_ENV === 'development' ? 'trace' : 'warn',
      serializers: {
        // Default error serializer
        err: stdSerializers.err
      }
    },
    // Create log file
    createWriteStream(`../logs/pino-${new Date().getTime()}.log`, {
      flags: 'wx'
    })
  );
  // Inform user we have switched to pino
  console.debug('F | ✦ Pino logger created, using that for logging');
}
