const { backup } = require('./backup');
const { fix } = require('./fix');
const { patches } = require('./patches');
const { scan } = require('./scan');
const { restore } = require('./restore');
const { clean } = require('./clean');
const { install } = require('./install');
const { upgrade } = require('./upgrade');

module.exports = {
  clean,
  install,
  scan,
  backup,
  restore,
  fix,
  patches,
  upgrade,
  actions: {
    fix: ['fix'],
    scan: ['audit'],
    clean: ['clean'],
    patches: ['patches'],
    install: ['install'],
    restore: ['restore'],
    upgrade: ['upgrade']
  },
  flags: {
    label: ['--label', '-l'],
    frozen: ['--frozen', '-f'],
    backup: ['--backup', '-b'],
    verbose: ['--verbose', '-v'],
    directory: ['--directory', '-d']
  }
};
