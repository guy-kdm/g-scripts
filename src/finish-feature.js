#!/usr/bin/env node
// todo add compdef _git gf='git branch'
const g = require('simple-git/promise')('/Users/guykedem/prj/pets/s-tests');
const argv = require('minimist')(process.argv.slice(2));
const inquirer = require('inquirer');

const name = argv._[0] || 'feature/newone';

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
    await g.rebase(['-i', '--fork-point']);
    console.log('Commits Revision complete.');
  }

  // Update develop
  console.log(`Updating local develop branch.`);
  await g.checkout('develop');

  // Since develop is a shared branch, user should not have changed it without pushing.
  await g.pull(['--ff-only']);

  await g.checkout(name);
  await g.rebase(['develop']);

  console.log('Merging to develop...');
  await g.checkout('develop');
  await g.merge([name, '--ff-only']);
  await g.push();

  // Deleting old branch
  await g.deleteLocalBranch(name).then(g.push('origin', name));
})();
