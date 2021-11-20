const Path = require('path');

const files = [];

// read directory with functions
function getFiles(fs, Directory) {
  fs.readdirSync(Directory).forEach((File) => {
    const Absolute = Path.join(Directory, File);
    if (fs.statSync(Absolute).isDirectory()) return getFiles(fs, Absolute);
    files.push(Absolute);
  });
  return files;
}

module.exports.run = async (fs) => {
  // get all function files
  const files = await getFiles(fs, './functions/');
  // only get file with '.js'
  const jsfiles = files.filter((f) => f.split('.').pop() === 'js');
  const funcLength = jsfiles.length;
  // check if functions are there
  if (jsfiles.length <= 0) return console.log(`[${module.exports.data.name}] No function(s) to load!`);

  if (DEBUG) console.log(`[${module.exports.data.name}] Loading ${funcLength} function${funcLength !== 1 ? 's' : ''}...`);

  // adding all functions
  jsfiles.forEach((f, i) => {
    const probs = require(`../../${f}`);
    // cleanup name
    const cleanName = f
      .replace(/\\|\//g, '_')
      .replace('functions_', '')
      .replace('.js', '');
    // abort entry if in disabled folder
    if (cleanName.search('archive_') !== -1) return;
    if (DEBUG) console.log(`[${module.exports.data.name}]     ${i + 1}) Loaded: ${cleanName}!`);
    // adding function to collection
    client.functions.set(cleanName, probs);
  });

  console.log(`[${module.exports.data.name}] Loaded ${funcLength} function${funcLength !== 1 ? 's' : ''}!`);
};

module.exports.data = {
  name: 'initFunctions',
};
