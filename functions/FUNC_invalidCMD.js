module.exports.run = async (message, subcmd) => {
  const confusResponses = [
    'You... what, now?',
    'Pardon me?',
    'Hah, yeah... what?',
    `Sorry, I have no idea what \`${subcmd}\` means.`,
    'Come again?',
    'Maybe you should try something else there, buddy.',
    `I tried to understand \`${subcmd}\`, trust me, but I just cannot.`,
    `Invalid comamnd: \`${subcmd}\` 💩`,
    `Sorry, I don't know this command -  \`${subcmd}\``,
    `Eh? Do you speak my language? Because I don't know \`${subcmd}\`...`,
    'I don\'t know what to do... UwU',
  ];

  const randomChoice = Math.floor(Math.random() * confusResponses.length);
  message.channel.send(confusResponses[randomChoice]);
  message.react('❌');
};

module.exports.help = {
  name: 'FUNC_invalidCMD',
};
