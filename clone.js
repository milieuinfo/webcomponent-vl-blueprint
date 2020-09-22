const {initializeWebcomponent} = require('./util/cloneUtils');
const path = require('path');

const currentPath = process.cwd();

const argv = require('yargs')
    .usage('Usage: $0 --name [string] --description [string] --path [string]')
    .command('run.js', 'Genereer boilerplate code voor een nieuwe webcomponent')
    .demandOption(['name', 'description'])
    .alias('name', 'n')
    .alias('description', 'd')
    .alias('path', 'p')
    .describe('name', 'Naam van de te genereren webcomponent')
    .describe('description', 'Omschrijving van de nieuwe component (description in package.json)')
    .describe('path', 'Locatie v/d component')
    .default('path', path.resolve(currentPath, '../'))
    .argv;

(async () => {
  await initializeWebcomponent({'name': argv.name, 'description': argv.description, 'path': argv.path});
})();

console.log(`Webcomponent ${argv.name} aangemaakt in ${argv.path}`);
