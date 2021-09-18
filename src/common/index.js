const { audit } = require('./audit');
const { test, execute } = require('./shell');
const { read, write, remove } = require('./json');

module.exports = {
  read,
  write,
  remove,
  audit,
  test,
  execute
};
