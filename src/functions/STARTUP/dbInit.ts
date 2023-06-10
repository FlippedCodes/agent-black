import { Sequelize } from 'sequelize';
import { CustomClient } from '../../typings/Extensions.ts';
import { initModels } from '../../typings/Models.ts';

export default async function (client: CustomClient): Promise<void> {
  const env = Deno.env.toObject();
  const { DBname, DBuser, DBpassword, NODE_ENV } = env;
  if (!DBname || !DBuser || !DBpassword)
    throw new SyntaxError('Missing database credentials');
  const sequelize = new Sequelize(DBname, DBuser, DBpassword, {
    dialect: 'mysql',
    logging: NODE_ENV === "development" ? client.stdrr?.debug : false
  });
  // Import models
  client.sequelize = sequelize;
  client.models? = initModels(sequelize);

  // Test database connection & sync models
  try {
    await sequelize.authenticate();
    client.stdrr?.info('Connected to database');
    await sequelize.sync();
    client.stdrr?.info('Synced models with database');
  } catch (e) {
    client.stdrr?.error('Failed to connect or sync database', { error: e });
    return Promise.reject(e);
  }
  return Promise.resolve();
}
