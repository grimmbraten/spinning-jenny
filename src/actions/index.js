const { backup } = require('./backup');
const { fix } = require('./fix');
const { patches } = require('./patches');
const { audit } = require('./audit');
const { restore } = require('./restore');
const { clean } = require('./clean');
const { install } = require('./install');

module.exports = {
  clean,
  install,
  audit,
  backup,
  restore,
  fix,
  patches,
  actions: {
    fix: ['fix'],
    audit: ['audit'],
    clean: ['clean'],
    patches: ['patches'],
    install: ['install'],
    restore: ['restore']
  },
  flags: {
    label: ['--label', '-l'],
    frozen: ['--frozen', '-f'],
    backup: ['--backup', '-b'],
    upgrade: ['--upgrade', '-u'],
    exclude: ['--exclude', '-e'],
    directory: ['--directory', '-d']
  }
};
