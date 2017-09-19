#!/usr/bin/env node
const g = require('simple-git')();
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

console.log(`Branching to ${branchName}`);
g.checkoutBranch(branchName);

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
