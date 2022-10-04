module.exports.run = async () => {
  // setup tables
  console.log('[DB] Syncing tables...');
  await sequelize.sync();
  await console.log('[DB] Done syncing!');
};

module.exports.data = {
  name: 'DBSync',
  callOn: '-',
};
