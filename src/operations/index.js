const { backup } = require('./backup');
const { clean } = require('./clean');
const { install } = require('./install');
const { restore } = require('./restore');
const { scan } = require('./scan');
const { upgrade } = require('./upgrade');

module.exports = {
  backup,
  clean,
  install,
  restore,
  scan,
  upgrade
};
