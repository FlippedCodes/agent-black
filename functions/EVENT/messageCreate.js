// checks if server is marked as blocked
async function checkServer(serverID) {
  const ParticipatingServer = require('../../database/models/ParticipatingServer');
  const found = await ParticipatingServer.findOne({ where: { serverID, blocked: true } })
    .catch((err) => console.error(err));
  return found;
}

module.exports.run = async (message) => {
  // debug protection
  if (DEBUG) return;
  // return if not prefix
  if (message.author.bot) return;
  if (!message.content.startsWith('a!')) return;
  const sentMessage = await message.channel.send('Hi there! I have been upgraded to Slash-Commands (v.3.0.0) and no longer support the old prefix of `a!` (Blame Discord). Please use the new `/` instead!');
  // await sentMessage.delete({ timeout: 20000 });
};

module.exports.data = {
  name: 'messageCreate',
};
