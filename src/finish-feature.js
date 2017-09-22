#!/usr/bin/env node
// todo add compdef _git gf='git branch'
const g = require('simple-git/promise')('/Users/guykedem/prj/pets/m-tests');
const argv = require('minimist')(process.argv.slice(2));
const inquirer = require('inquirer');

const name = argv._[0] || 'feature/yab';

(async () => {
  await g.checkout(name);

  const { shouldRebaseToSelf } = await inquirer.prompt([
    {
      message: `Before proceeding, would you like to review or revise your commits`,
      type: 'confirm',
      name: 'shouldRebaseToSelf',
    },
  ]);

  if (shouldRebaseToSelf) {
    const base = g.raw(['merge-base', '--fork-point', 'develop', name]);
    console.log(base);
    await g.rebase(['-i', base]);
    console.log('Commits Revision complete.');
  }

  // update develop
  console.log(`Updating local develop branch.`);
  await g.checkout('develop');
  await g.pull(['--ff-only']);

  // rebasing to develop
  await g.checkout(name);
  await g.rebase(['develop']);

  //todo open a pull request stead of merging
  console.log('Merging to develop...');
  await g.checkout('develop');
  await g.merge([name, '--no-ff']);
  await g.push();

  // deleting old branch
  await g.deleteLocalBranch(name).then(g.push('origin', name));
})();
