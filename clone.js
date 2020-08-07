const simpleGit = require('simple-git');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const path = require('path');
const fs = require('fs');
const { exit } = require('process');

readline.question(`Wat is de naam van de nieuwe webcomponent (prefix webcomponent-vl-ui- wordt automatisch toegevoegd)? `, (naam) => {
  readline.question(`Wat is de description van de component? `, (description) => {
    const currentPath = process.cwd();
    const defaultPath = path.resolve(currentPath, '../webcomponent-vl-ui-' + naam);
    readline.question(`Waar mag het project opgeslagen worden? [${defaultPath}]: `, async (path) => {
      await initializeWebcomponent({
        naam: naam,
        description: description,
        path: path ? path : defaultPath,
      });
      readline.close();
    });
  });
});

async function initializeWebcomponent(options) {
  await copyFolder(process.cwd(), options.path, ['.git', 'node_modules', 'util', 'README.md', 'clone.sh', 'clone.js', 'package-lock.json']);
  await replaceDescriptionInReadMe(path.resolve(options.path, 'README.md.template'), options.description);
  await replaceDescriptionInPackageJson(path.resolve(options.path, 'package.json'), options.description);
  await replaceInFile(path.resolve(options.path, 'package.json'), options.naam);
  await replaceInFile(path.resolve(options.path, 'src/vl-blueprint.js'), options.naam);
  await replaceInFile(path.resolve(options.path, 'src/style.scss'), options.naam);
  await replaceInFile(path.resolve(options.path, 'README.md.template'), options.naam);
  await replaceInFile(path.resolve(options.path, 'index.js'), options.naam);
  await replaceInFile(path.resolve(options.path, 'src/index.js'), options.naam);

  await replaceInFile(path.resolve(options.path, 'bamboo-specs/bamboo.yml'), options.naam);
  await replaceInFile(path.resolve(options.path, 'demo/vl-blueprint.html'), options.naam);
  await replaceInFile(path.resolve(options.path, 'test/e2e/components/vl-blueprint.js'), options.naam);
  await replaceInFile(path.resolve(options.path, 'test/e2e/pages/vl-blueprint.page.js'), options.naam);
  await replaceInFile(path.resolve(options.path, 'test/e2e/blueprint.test.js'), options.naam);
  await replaceInFile(path.resolve(options.path, 'test/unit/vl-blueprint.test.html'), options.naam);

  await rename(path.resolve(options.path, 'src/vl-blueprint.js'), path.resolve(options.path, `src/vl-${options.naam}.js`));
  await rename(path.resolve(options.path, 'README.md.template'), path.resolve(options.path, 'README.md'));

  await rename(path.resolve(options.path, 'demo/vl-blueprint.html'), path.resolve(options.path, `demo/vl-${options.naam}.html`));
  await rename(path.resolve(options.path, 'test/e2e/components/vl-blueprint.js'), path.resolve(options.path, `test/e2e/components/vl-${options.naam}.js`));
  await rename(path.resolve(options.path, 'test/e2e/pages/vl-blueprint.page.js'), path.resolve(options.path, `test/e2e/pages/vl-${options.naam}.page.js`));
  await rename(path.resolve(options.path, 'test/e2e/blueprint.test.js'), path.resolve(options.path, `test/e2e/${options.naam}.test.js`));
  await rename(path.resolve(options.path, 'test/unit/vl-blueprint.test.html'), path.resolve(options.path, `test/unit/vl-${options.naam}.test.html`));

  await setupGitRepo(options);
}

async function replaceDescriptionInReadMe(path, description) {
  return replace(path, '@description@', description);
}

async function replaceDescriptionInPackageJson(path, description) {
  const data = await fs.promises.readFile(path, 'utf8');
  const packageJsonData = JSON.parse(data);
  packageJsonData.description = description;
  const result = JSON.stringify(packageJsonData, null, '\t');
  await fs.promises.writeFile(path, result, 'utf8');
}

async function replaceInFile(path, naam) {
  const naamLowercase = naam.toLowerCase();
  const naamCamelcaseZonderDashes = naamLowercase.replace(/(^|[\s-])\S/g, function(match) {
    return match.toUpperCase();
  }).replace(/-/g, '');
  const naamUppercaseZonderDashes = naamLowercase.toUpperCase().replace(/-/g, '');
  const data = await fs.promises.readFile(path, 'utf8');
  let result = data;
  result = result.replace(/blueprint/g, naamLowercase);
  result = result.replace(/Blueprint/g, naamCamelcaseZonderDashes);
  result = result.replace(/BLUEPRINT/g, naamUppercaseZonderDashes);
  return fs.promises.writeFile(path, result, 'utf8');
}

async function rename(src, dest) {
  await fs.promises.rename(src, dest);
}

async function replace(someFile, search, replacement) {
  const data = await fs.promises.readFile(someFile, 'utf8');
  const result = await data.replace(search, replacement);
  return fs.promises.writeFile(someFile, result, 'utf8');
}

async function copyFolder(from, to, exclusions) {
  try {
    await fs.promises.mkdir(to);
    const dirs = await fs.promises.readdir(from);

    for (let index = 0; index < dirs.length; index++) {
      const element = dirs[index];
      if (!exclusions.includes(element)) {
        if ((await fs.promises.lstat(path.join(from, element))).isFile()) {
          await fs.promises.copyFile(path.join(from, element), path.join(to, element));
        } else {
          await copyFolder(path.join(from, element), path.join(to, element), exclusions);
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
}

async function setupGitRepo(options) {
  const git = simpleGit({'baseDir': options.path});
  try {
    await git.init();
    await git.add('./*');
    await git.commit('Automated commit by vl-blueprint');
    await git.addRemote('origin', `https://github.com/milieuinfo/${options.naam}.git`);
    console.log(`Setup van nieuw project klaar! \n Lokale git repository is aangemaakt met remote https://github.com/milieuinfo/webcomponent-vl-ui-${options.naam}.git \n VERGEET NIET DE REPOSITORY OP GITHUB AAN TE MAKEN!\n Bedankt voor het vertrouwen in UIG!`);
  } catch (e) {
    console.log(e);
  }
}

