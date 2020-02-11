const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const path = require('path');

readline.question(`Wat is de naam van de nieuwe webcomponent? `, (naam) => {
	readline.question(`Wat is de description van de component? `, (description) => {
		const currentPath = process.cwd();
		const defaultPath = path.resolve(currentPath, "../webcomponent-vl-ui-" + naam);
		readline.question(`Waar mag het project opgeslagen worden? [${defaultPath}]: `, (path) => {
			initializeWebcomponent({
				naam: naam,
				description: description,
				path: path ? path : defaultPath
			});
			readline.close();
		});
	});
})

function copyFolderSync(from, to, exclusions) {
	const fs = require("fs");
    fs.mkdirSync(to);
    fs.readdirSync(from).forEach(element => {
    	if (exclusions.indexOf(element) == -1) {
    		if (fs.lstatSync(path.join(from, element)).isFile()) {
    			fs.copyFileSync(path.join(from, element), path.join(to, element));
    		} else {
    			copyFolderSync(path.join(from, element), path.join(to, element), exclusions);
    		}
    	}
    });
}

function initializeWebcomponent(options) {
	copyFolderSync(process.cwd(), options.path, [".git", "node_modules", "util", "README.md", "clone.sh", "package-lock.json"]);
	replaceDescriptionInReadMe(path.resolve(options.path, "README.md.template"), options.description);
	replaceDescriptionInPackageJson(path.resolve(options.path, "package.json"), options.description);
	replaceInFile(path.resolve(options.path, "package.json"), options.naam);
	replaceInFile(path.resolve(options.path, "src/vl-blueprint.src.js"), options.naam);
	replaceInFile(path.resolve(options.path, "src/style.scss"), options.naam);
	replaceInFile(path.resolve(options.path, "README.md.template"), options.naam);
	replaceInFile(path.resolve(options.path, "index.js"), options.naam);
	replaceInFile(path.resolve(options.path, "src/index.js"), options.naam);

	replaceInFile(path.resolve(options.path, "bamboo-specs/bamboo.yml"), options.naam);
	replaceInFile(path.resolve(options.path, "demo/vl-blueprint.html"), options.naam);
	replaceInFile(path.resolve(options.path, "test/e2e/components/vl-blueprint.js"), options.naam);
	replaceInFile(path.resolve(options.path, "test/e2e/pages/vl-blueprint.page.js"), options.naam);
	replaceInFile(path.resolve(options.path, "test/e2e/blueprint.test.js"), options.naam);
	replaceInFile(path.resolve(options.path, "test/unit/vl-blueprint.test.html"), options.naam);

	rename(path.resolve(options.path, "src/vl-blueprint.src.js"), path.resolve(options.path, `src/vl-${options.naam}.src.js`));
	rename(path.resolve(options.path, "README.md.template"), path.resolve(options.path, "README.md"));

	rename(path.resolve(options.path, "demo/vl-blueprint.html"), path.resolve(options.path, `demo/vl-${options.naam}.html`));
	rename(path.resolve(options.path, "test/e2e/components/vl-blueprint.js"), path.resolve(options.path, `test/e2e/components/vl-${options.naam}.js`));
	rename(path.resolve(options.path, "test/e2e/pages/vl-blueprint.page.js"), path.resolve(options.path, `test/e2e/pages/vl-${options.naam}.page.js`));
	rename(path.resolve(options.path, "test/e2e/blueprint.test.js"), path.resolve(options.path, `test/e2e/${options.naam}.test.js`));
	rename(path.resolve(options.path, "test/unit/vl-blueprint.test.html"), path.resolve(options.path, `test/unit/vl-${options.naam}.test.html`));
}

function replaceDescriptionInReadMe(path, description) {
	replace(path, "@description@", description);
}

function replaceDescriptionInPackageJson(path, description) {
	var fs = require('fs')
	const data = fs.readFileSync(path, 'utf8');
	var packageJsonData = JSON.parse(data);
	packageJsonData.description = description;
	const result = JSON.stringify(packageJsonData, null, '\t');
	fs.writeFileSync(path, result, 'utf8');
}

function replaceInFile(path, naam) {
	replace(path, "blueprint", naam);
	replace(path, "Blueprint", capitalize(naam));
	replace(path, "BLUEPRINT", naam.toUpperCase());
}

function rename(src, dest) {
	var fs = require('fs')
	fs.renameSync(src, dest);	
}

function replace(someFile, search, replacement) {
	var fs = require('fs')
	const data = fs.readFileSync(someFile, 'utf8');
	var result = data.replace(search, replacement);
	fs.writeFileSync(someFile, result, 'utf8');
}

function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}