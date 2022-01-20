const { help } = require('./help');
const { list, manage } = require('./config');
const { bin, version, repository } = require('./package');

module.exports = {
  help,
  bin,
  list,
  manage,
  version,
  repository,
  commands: {
    help: 'help',
    alias: 'alias',
    config: 'config',
    version: 'version',
    repository: 'repository'
  }
};
