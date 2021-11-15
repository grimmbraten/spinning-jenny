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
    help: '--help',
    config: '--config',
    bin: '--bin',
    version: '--version',
    repository: '--repository'
  }
};
