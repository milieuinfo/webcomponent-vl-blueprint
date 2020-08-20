const fs = require('fs').promises;
const path = require('path');
const { setupGitRepo } = require('./gitUtils');

async function initializeWebcomponent(options) {
  try {
    const savePath = getSavePath(options);
    await copyFolder(process.cwd(), savePath, ['.git', 'node_modules', 'util', 'README.md', 'clone.sh', 'clone.js', 'package-lock.json']);
    await replaceDescriptionInReadMe(path.resolve(savePath, 'README.md.template'), options.description);
    await replaceDescriptionInPackageJson(path.resolve(savePath, 'package.json'), options.description);
    await replaceInFile(path.resolve(savePath, 'package.json'), options.name);
    await replaceInFile(path.resolve(savePath, 'src/vl-blueprint.js'), options.name);
    await replaceInFile(path.resolve(savePath, 'src/style.scss'), options.name);
    await replaceInFile(path.resolve(savePath, 'README.md.template'), options.name);
    await replaceInFile(path.resolve(savePath, 'index.js'), options.name);
    await replaceInFile(path.resolve(savePath, 'src/index.js'), options.name);
    
    await replaceInFile(path.resolve(savePath, 'bamboo-specs/bamboo.yml'), options.name);
    await replaceInFile(path.resolve(savePath, 'demo/vl-blueprint.html'), options.name);
    await replaceInFile(path.resolve(savePath, 'test/e2e/components/vl-blueprint.js'), options.name);
    await replaceInFile(path.resolve(savePath, 'test/e2e/pages/vl-blueprint.page.js'), options.name);
    await replaceInFile(path.resolve(savePath, 'test/e2e/blueprint.test.js'), options.name);
    await replaceInFile(path.resolve(savePath, 'test/unit/vl-blueprint.test.html'), options.name);
    
    await rename(path.resolve(savePath, 'src/vl-blueprint.js'), path.resolve(savePath, `src/vl-${options.name}.js`));
    await rename(path.resolve(savePath, 'README.md.template'), path.resolve(savePath, 'README.md'));
    
    await rename(path.resolve(savePath, 'demo/vl-blueprint.html'), path.resolve(savePath, `demo/vl-${options.name}.html`));
    await rename(path.resolve(savePath, 'test/e2e/components/vl-blueprint.js'), path.resolve(savePath, `test/e2e/components/vl-${options.name}.js`));
    await rename(path.resolve(savePath, 'test/e2e/pages/vl-blueprint.page.js'), path.resolve(savePath, `test/e2e/pages/vl-${options.name}.page.js`));
    await rename(path.resolve(savePath, 'test/e2e/blueprint.test.js'), path.resolve(savePath, `test/e2e/${options.name}.test.js`));
    await rename(path.resolve(savePath, 'test/unit/vl-blueprint.test.html'), path.resolve(savePath, `test/unit/vl-${options.name}.test.html`));

    await setupGitRepo({path: savePath, name: options.name});
  } catch (e) {
    console.error(e);
    process.exit(1, e);
  }
}

function getSavePath(options) {
  return path.join(options.path, `webcomponent-vl-ui-${options.name}`);
}

async function replaceDescriptionInReadMe(path, description) {
  return replace(path, '@description@', description);
}

async function replaceDescriptionInPackageJson(path, description) {
  const data = await fs.readFile(path, 'utf8');
  const packageJsonData = JSON.parse(data);
  packageJsonData.description = description;
  const result = JSON.stringify(packageJsonData, null, '\t');
  return fs.writeFile(path, result, 'utf8');
}

async function replaceInFile(path, name) {
  const nameLowercase = name.toLowerCase();
  const nameCamelcaseZonderDashes = await nameLowercase.replace(/(^|[\s-])\S/g, function (match) {
    return match.toUpperCase();
  }).replace(/-/g, '');
  const nameUppercaseZonderDashes = await nameLowercase.toUpperCase().replace(/-/g, '');
  const data = await fs.readFile(path, 'utf8');
  let result = data;
  result = await result.replace(/blueprint/g, nameLowercase);
  result = await result.replace(/Blueprint/g, nameCamelcaseZonderDashes);
  result = await result.replace(/BLUEPRINT/g, nameUppercaseZonderDashes);
  return fs.writeFile(path, result, 'utf8');
}

async function rename(src, dest) {
  return fs.rename(src, dest);
}

async function replace(someFile, search, replacement) {
  const data = await fs.readFile(someFile, 'utf8');
  const result = data.replace(search, replacement);
  return fs.writeFile(someFile, result, 'utf8');
}

async function copyFolder(from, to, exclusions) {
    await fs.mkdir(to);
    const dirs = await fs.readdir(from);
    for (let index = 0; index < dirs.length; index++) {
      if (!exclusions.includes(dirs[index])) {
        if ((await (await fs.lstat(path.join(from, dirs[index]))).isFile())) {
          await fs.copyFile(path.join(from, dirs[index]), path.join(to, dirs[index]));
        } else {
          await copyFolder(path.join(from, dirs[index]), path.join(to, dirs[index]), exclusions);
        }
      }
    }
}

module.exports = { initializeWebcomponent };
