const fs = require('fs');
const path = require('path');

function initializeWebcomponent(options) {
  const savePath = getSavePath(options);
  copyFolderSync(process.cwd(), savePath, ['.git', 'node_modules', 'util', 'README.md', 'clone.sh', 'clone.js', 'package-lock.json']);
  replaceDescriptionInReadMe(path.resolve(savePath, 'README.md.template'), options.description);
  replaceDescriptionInPackageJson(path.resolve(savePath, 'package.json'), options.description);
  replaceInFile(path.resolve(savePath, 'package.json'), options.name);
  replaceInFile(path.resolve(savePath, 'src/vl-blueprint.js'), options.name);
  replaceInFile(path.resolve(savePath, 'src/style.scss'), options.name);
  replaceInFile(path.resolve(savePath, 'README.md.template'), options.name);
  replaceInFile(path.resolve(savePath, 'index.js'), options.name);
  replaceInFile(path.resolve(savePath, 'src/index.js'), options.name);

  replaceInFile(path.resolve(savePath, 'bamboo-specs/bamboo.yml'), options.name);
  replaceInFile(path.resolve(savePath, 'demo/vl-blueprint.html'), options.name);
  replaceInFile(path.resolve(savePath, 'test/e2e/components/vl-blueprint.js'), options.name);
  replaceInFile(path.resolve(savePath, 'test/e2e/pages/vl-blueprint.page.js'), options.name);
  replaceInFile(path.resolve(savePath, 'test/e2e/blueprint.test.js'), options.name);
  replaceInFile(path.resolve(savePath, 'test/unit/vl-blueprint.test.html'), options.name);

  rename(path.resolve(savePath, 'src/vl-blueprint.js'), path.resolve(savePath, `src/vl-${options.name}.js`));
  rename(path.resolve(savePath, 'README.md.template'), path.resolve(savePath, 'README.md'));

  rename(path.resolve(savePath, 'demo/vl-blueprint.html'), path.resolve(savePath, `demo/vl-${options.name}.html`));
  rename(path.resolve(savePath, 'test/e2e/components/vl-blueprint.js'), path.resolve(savePath, `test/e2e/components/vl-${options.name}.js`));
  rename(path.resolve(savePath, 'test/e2e/pages/vl-blueprint.page.js'), path.resolve(savePath, `test/e2e/pages/vl-${options.name}.page.js`));
  rename(path.resolve(savePath, 'test/e2e/blueprint.test.js'), path.resolve(savePath, `test/e2e/${options.name}.test.js`));
  rename(path.resolve(savePath, 'test/unit/vl-blueprint.test.html'), path.resolve(savePath, `test/unit/vl-${options.name}.test.html`));
}

function getSavePath(options) {
  return path.join(options.path, `webcomponent-vl-ui-${options.name}`);
}

function replaceDescriptionInReadMe(path, description) {
  replace(path, '@description@', description);
}

function replaceDescriptionInPackageJson(path, description) {
  const data = fs.readFileSync(path, 'utf8');
  const packageJsonData = JSON.parse(data);
  packageJsonData.description = description;
  const result = JSON.stringify(packageJsonData, null, '\t');
  fs.writeFileSync(path, result, 'utf8');
}

function replaceInFile(path, name) {
  const nameLowercase = name.toLowerCase();
  const nameCamelcaseZonderDashes = nameLowercase.replace(/(^|[\s-])\S/g, function(match) {
    return match.toUpperCase();
  }).replace(/-/g, '');
  const nameUppercaseZonderDashes = nameLowercase.toUpperCase().replace(/-/g, '');
  const data = fs.readFileSync(path, 'utf8');
  let result = data;
  result = result.replace(/blueprint/g, nameLowercase);
  result = result.replace(/Blueprint/g, nameCamelcaseZonderDashes);
  result = result.replace(/BLUEPRINT/g, nameUppercaseZonderDashes);
  fs.writeFileSync(path, result, 'utf8');
}

function rename(src, dest) {
  fs.renameSync(src, dest);
}

function replace(someFile, search, replacement) {
  const data = fs.readFileSync(someFile, 'utf8');
  const result = data.replace(search, replacement);
  fs.writeFileSync(someFile, result, 'utf8');
}

function copyFolderSync(from, to, exclusions) {
  fs.mkdirSync(to);
  fs.readdirSync(from).forEach((element) => {
    if (!exclusions.includes(element)) {
      if (fs.lstatSync(path.join(from, element)).isFile()) {
        fs.copyFileSync(path.join(from, element), path.join(to, element));
      } else {
        copyFolderSync(path.join(from, element), path.join(to, element), exclusions);
      }
    }
  });
}

module.exports = {initializeWebcomponent};
