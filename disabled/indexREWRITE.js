// const Handlebars = require('handlebars');

// function configToTemplate(config) {
//   if (typeof config === 'string') return Handlebars.compile(config);
//   const result = {};
//   for ([key, value] of Object.entries(config)) {
//     result[key] = configToTemplate(value);
//   }
//   return result;
// }

// const config = require('./config/lang.json');

// const allTemplates = configToTemplate(config);

// console.log(allTemplates.command.ping.PingAwnser({
//   msgLatency: '333',
//   apiLatency: '666',
// }));

// const Handlebars = require('handlebars');

// const templateRaw = 'Hello, {{name}}';

// const template = Handlebars.compile(templateRaw);

// console.log(template({
//   name: 'Mouse',
// }));

const Discord = require('discord.js');

const client = new Discord.Client({ disableEveryone: true });

const mysql = require('mysql');

const fs = require('fs');

const config = require('./config/main.json');

config.env = new Discord.Collection();

// set Language templates
// const SETUP_langFile = require('./functions/SETUP_langFile.js');

// const lang = SETUP_langFile.run();

console.log(lang.command.ping.awnser({
  msgLatency: '333',
  apiLatency: '666',
}));
