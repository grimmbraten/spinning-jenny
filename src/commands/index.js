const { help } = require('./help');
const { view, manage } = require('./config');
const { bin, version, repository } = require('./package');

module.exports = {
  help,
  bin,
  view,
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
