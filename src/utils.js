const g = require('simple-git')('/Users/guykedem/prj/pets/s-tests');

g.validateRepoState = function() {
  this.status((err, st) => console.log(st));
};

g.validateRepoState(() => console.log);
