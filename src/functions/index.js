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
  flags: {
    advisories: ['--advisories', '-a'],
    backup: ['--backup', '-b'],
    clean: ['--clean', '-c'],
    directory: ['--directory', '-d'],
    install: ['--install', '-i'],
    protect: ['--protect', '-p'],
    scan: ['--scan', '-s'],
    upgrade: ['--upgrade', '-u']
  }
};
