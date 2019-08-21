module.exports.run = async (client, message, DB, config) => {
  // TODO: cache Cease cmd status for no DB overusage
  DB.query('SELECT * FROM kcs_cmd_status WHERE cmdName = \'cease\'', (err, rows) => {
    if (err) throw err;
    if (rows[0].enabled === 1 && config.trollusers.includes(message.author.id)) { message.react(client.guilds.get(config.guildID).emojis.get(config.ceaseEmoji)); }
  });
};

module.exports.help = {
  name: 'cease',
};
