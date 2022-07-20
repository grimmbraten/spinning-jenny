const { backup } = require('./backup');
const { fix } = require('./fix');
const { advise } = require('./advise');
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
  advise,
  actions: {
    fix: ['fix'],
    audit: ['audit'],
    clean: ['clean'],
    advise: ['advise'],
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
