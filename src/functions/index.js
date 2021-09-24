const { backup } = require('./backup');
const { protect } = require('./protect');
const { advise } = require('./advise');
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
  protect,
  advise,
  upgrade,
  actions: {
    advise: ['advise', '-a'],
    clean: ['clean', '-c'],
    install: ['install', '-i'],
    protect: ['protect', '-p'],
    restore: ['restore', '-r'],
    scan: ['scan', '-s'],
    upgrade: ['upgrade', '-u']
  },
  flags: {
    backup: ['--backup', '-b'],
    directory: ['--directory', '-d'],
    frozen: ['--frozen', '-f'],
    label: ['--label', '-l'],
    verbose: ['--verbose', '-v']
  }
};
