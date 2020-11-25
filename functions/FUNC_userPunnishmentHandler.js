module.exports.run = async (fromTicker, comamnd) => {
  // if "fromTicker" is true, dont checkuserPunnishment and use "command"
  // call checkUserPunnishment, return: if not exist, then
  // create punnishment entry
  // get punnishment command and values
  // get server specific values (RoleID, serverID, ...)
  // call correct command: Ban, temp-ban, Unban, kick, assignRole, removeRole
  // if code for commands is small, use functions. if too big use own file functions
};

module.exports.help = {
  name: 'FUNC_createUserPunnishment',
};
