function deleteRoles(member, DB) {
  DB.query(`DELETE kcs_thevoid WHERE ID = '${member.id}'`);
}

function saveRoles(member, DB) {
  deleteRoles(member, DB);
  member.roles.forEach((role) => {
    DB.query(`INSERT INTO kcs_thevoid (ID, roleID) VALUES ('${member.id}', '${role.id}')`);
  });
}

module.exports.run = async (client, message, args, DB, config) => {
  if (!config.env.get('isTeam')) return message.react('❌');
  if (config.trollusers.includes(message.author.id)) {
    client.functions.get('insult_gen').run(message)
      .catch(console.log);
    return;
  }
  config.trollusers.forEach((user) => {
    if (message.guild.members.get(user)) {
      let member = message.guild.members.get(user);
      saveRoles(member, DB);
    }
    // TODO: Check if user is on server
    // assign roles
    // save previos roles in DB; clear before saving
    let member = message.guild.members.get(user);
    member.removeRoles(member.roles);
    member.addRole(config.mutedRole);
    // message.channel.send('semperfidragon7 is now in the void!');
  });
};

module.exports.help = {
  name: 'tothevoid',
};
