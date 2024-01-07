import { Sequelize } from 'sequelize';
import { CustomClient } from '../../typings/Extensions.js';

export const name = 'database';
export async function execute(client: CustomClient<true>): Promise<void> {
  const { DBdatabase, DBusername, DBpassword, NODE_ENV } = process.env;
  // Intentional delay to allow other startup functions to finish
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Login to Sequelize
  const sequelize = new Sequelize(DBdatabase, DBusername, DBpassword, {
    dialect: 'mysql',
    logging: NODE_ENV === 'development' ? (sql, timings) => client.logs.debug({ msg: sql, timings }) : false,
    benchmark: true
  });
  // Load models
  const loader = await import('../../typings/Models.js');
  client.models = loader.initModels(sequelize);
  await sequelize
    .authenticate()
    .then(() => sequelize.sync())
    .then(() => client.logs.info(`F | ✓ Database connection established`))
    .catch((err) => client.logs.warn({ msg: `F | ✘ Failed to create database connection`, err }));
  // Add Sequelize
  client.models = sequelize.models as unknown as ReturnType<typeof loader.initModels>;
  client.sequelize = sequelize;
  return;
}
