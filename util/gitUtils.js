const simpleGit = require('simple-git');

async function setupGitRepo(options) {
  const git = simpleGit({'baseDir': options.path});
  try {
    await git.init();
    await git.add('./*');
    await git.commit('Automated commit by vl-blueprint');
    await git.addRemote('origin', `https://github.com/milieuinfo/webcomponent-vl-ui-${options.name}.git`);
    console.log(`Setup van nieuw project klaar! \n Lokale git repository is aangemaakt met remote https://github.com/milieuinfo/webcomponent-vl-ui-${options.name}.git \n VERGEET NIET DE REPOSITORY OP GITHUB AAN TE MAKEN!\n Bedankt voor het vertrouwen in UIG!`);
  } catch (e) {
    console.log(e);
  }
}

module.exports = {setupGitRepo};
