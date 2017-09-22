#!/usr/bin/env node
const g = require('simple-git')('/Users/guykedem/prj/pets/s-tests');
var argv = require('minimist')(process.argv.slice(2));

const name = argv._[0];
if (!name) {
  console.log(
    `Please specify feature name and prefix (default prefix is 'feature')
    git feat [name] [-b (bug) | -c (CR) | -r (refactor)]`
  );
}

const prefix =
  (argv.c && 'CR') || (argv.b && 'bug') || (argv.r && 'refactor') || 'feature';

const branchName = `${prefix}/${name}`;

// todo: warn if branch exists locally or just remotely, warn if no develop ext.
// g.branch((err, branchSummery) => {
//   console.log(branchSummery);
//   const developBranchExists = branchSummery.all.includes('develop')
//   if (!developBranchExists) {
//     console.log('No develop branch exists, would you like to create it?')
//   }
// if ((branchSummery.current = 'master'))
//   console.log(
//     `You're currently on the master branch. Would you like to make a hotfix `
//   );
// });

console.log(`Branching to ${branchName}.`);
g.checkoutBranch(branchName, 'develop');

g.getRemotes(true, (err, remotes) =>
  remotes.map(({ name: remote }) => {
    if (!remote) {
      console.log('No remotes detected, branch is local only.');
      return;
    }

    console.log(`Pushing ${branchName} to ${remote}.`);
    g.push(remote, branchName);
  })
);
