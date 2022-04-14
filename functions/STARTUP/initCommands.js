const Path = require('path');

const files = [];

function getFiles(fs, Directory) {
  fs.readdirSync(Directory).forEach((File) => {
    const Absolute = Path.join(Directory, File);
    if (fs.statSync(Absolute).isDirectory()) return getFiles(fs, Absolute);
    files.push(Absolute);
  });
  return files;
}

module.exports.run = async (fs) => {
  // create empty array to store command submittions
  const commandsSubmit = [];
  // get all command files
  const files = await getFiles(fs, './commands/');
  // only get file with '.js'
  const jsfiles = files.filter((f) => f.split('.').pop() === 'js');
  const cmdLength = jsfiles.length;
  // check if commands are there
  if (cmdLength <= 0) return console.log(`[${module.exports.data.name}] No command(s) to load!`);
  // announcing command loading
  if (DEBUG) console.log(`[${module.exports.data.name}] Loading ${cmdLength} command${cmdLength !== 1 ? 's' : ''}...`);

  // adding all commands
  await jsfiles.forEach((f, i) => {
    // get module functions and info
    const probs = require(`../../${f}`);
    // cleanup name
    const cleanName = f
      .replace(/\\|\//g, '_')
      .replace('commands_', '')
      .replace('.js', '');
    // abort entry if in disabled folder
    if (cleanName.search('archive_') !== -1) return;
    // announcing command loading
    if (DEBUG) console.log(`[${module.exports.data.name}]     ${i + 1}) Loaded: ${cleanName}!`);
    // adding command to collection
    client.commands.set(cleanName, probs);
    // if not subcommand: adding command to submittion to discord
    if (!probs.data.subcommand) commandsSubmit.push(probs.data.toJSON());
  });
  const registerLength = commandsSubmit.length;

  await console.log(`[${module.exports.data.name}] Loaded ${cmdLength} command${cmdLength !== 1 ? 's' : ''}!`);
  await console.log(`[${module.exports.data.name}] Registering ${registerLength} command${registerLength !== 1 ? 's' : ''}...`);
  // submit commands to discord api| Dev: one guild only, prod: globaly
  // WARN: TODO: make sure it doesn't disable the production commands while in debug mode
  if (DEBUG) {
    const changedCommands = commandsSubmit.map((command) => {
      const newCommand = command;
      newCommand.name = `${command.name}_dev`;
      return newCommand;
    });
    await client.application.commands.set(changedCommands, process.env.devGuild).catch(ERR);
  } else await client.application.commands.set(commandsSubmit).catch(ERR);
  console.log(`[${module.exports.data.name}] ${registerLength} command${registerLength !== 1 ? 's' : ''} registered!`);
};

module.exports.data = {
  name: 'initCommands',
};
