const { audit } = require('./audit');
const { execute } = require('./shell');
const { read, write, remove } = require('./json');

module.exports = {
  read,
  write,
  remove,
  audit,
  execute
};
