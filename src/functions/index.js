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
    patches: ['patches', '-p'],
    clean: ['clean', '-c'],
    install: ['install', '-i'],
    fix: ['fix', '-f'],
    restore: ['restore', '-r'],
    scan: ['audit', '-a'],
    upgrade: ['upgrade', '-u']
  },
  flags: {
    backup: ['--backup'],
    directory: ['--directory'],
    frozen: ['--frozen'],
    label: ['--label'],
    verbose: ['--verbose']
  }
};
