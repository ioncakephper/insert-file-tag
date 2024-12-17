#!/usr/bin/env node

const { Command } = require('commander');
const { processAndSaveFileWithTags } = require('./src/source-processor');
const packageJson = require('./package.json');
const path = require('path');
const { globSync } = require('glob');

const program = new Command();

program
  .name(packageJson.name)
  .version(packageJson.version)
  .description(packageJson.description)
  .argument('[pattern...]', 'filename pattern(s) to process for insert tags', ['README.md'])
  .option('-o, --output <path>', 'output directory for processed files', '')
  .option('-v, --verbose', 'verbose output', false)
  .action((pattern, options) => {
    pattern = Array.isArray(pattern) ? pattern : [pattern];
    const filenames = globSync(pattern);
    filenames.forEach((filename) => {
      const outputFilename = path.join(options.output, filename);
      try {
        processAndSaveFileWithTags(filename, outputFilename);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    })

  })
  .configureHelp({
    sortOptions: true,
    sortSubcommands: true,
    subcommandTerm: '<command>',
    helpWidth: 80
  });

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
