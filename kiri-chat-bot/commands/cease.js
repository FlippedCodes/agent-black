module.exports.run = async (client, message, args, DB, config) => {
  if (!config.env.get('isTeam')) return message.react('❌');
  if (config.trollusers.includes(message.author.id)) {
    client.functions.get('insult_gen').run(message)
      .catch(console.log);
    return;
  }
  DB.query('SELECT * FROM kcs_cmd_status WHERE cmdName = \'cease\'', (err, rows) => {
    if (err) throw err;
    if (rows[0].enabled === 0) {
      DB.query('UPDATE kcs_cmd_status SET enabled = \'1\' WHERE cmdName = \'cease\'');
      message.channel.send('<:cease:558180046766866462> is enabled!');
    } else {
      DB.query('UPDATE kcs_cmd_status SET enabled = \'0\' WHERE cmdName = \'cease\'');
      message.channel.send('<:cease:558180046766866462> is disabled!');
    }
  });
};

module.exports.help = {
  name: 'cease',
};
