module.exports.run = async (client, fs, config) => {
  const commandsFolder = config.setup.moduleFolders.commandsFolder;
  // read directory with commands
  fs.readdir(`./${commandsFolder}`, (err, files) => {
    // error if fails
    if (err) console.error(err);

    // removal of '.js' in the end of the file
    const jsfiles = files.filter((f) => f.split('.').pop() === 'js');

    // check if commands are there
    if (jsfiles.length <= 0) return console.log(`[${module.exports.help.name}] No command(s) to load!`);

    if (config.env.get('inDev')) console.log(`[${module.exports.help.name}] Loading ${jsfiles.length} command(s)...`);

    // adding all commands
    jsfiles.forEach((f, i) => {
      let probs = require(`../${commandsFolder}/${f}`);
      if (config.env.get('inDev')) console.log(`[${module.exports.help.name}]     ${i + 1}) Loaded: ${f}!`);
      // adding command to collection
      client.commands.set(probs.help.name, probs);
    });

    console.log(`[${module.exports.help.name}] Loaded ${jsfiles.length} command(s)!`);
  });
};

module.exports.help = {
  name: 'STARTUP_initCommands',
};
