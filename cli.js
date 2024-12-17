#!/usr/bin/env node

const { Command } = require('commander');
const { processAndSaveFileWithTags } = require('./src/source-processor');
const packageJson = require('./package.json');
const path = require('path');

const program = new Command();

program
  .name(packageJson.name)
  .version(packageJson.version)
  .description(packageJson.description)
  .argument('<filename>', 'file to process for insert tags')
  .option('-o, --output <output>', 'output filename', '')
  .action((filename, options) => {
    const outputFilename = options.output || filename;
    try {
      processAndSaveFileWithTags(filename, outputFilename);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
    
  });

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}

