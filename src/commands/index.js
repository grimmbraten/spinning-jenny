const { help } = require('./help');
const { view, manage } = require('./config');
const { bin, version, description, repository } = require('./package');

module.exports = {
  help,
  bin,
  view,
  manage,
  version,
  description,
  repository,
  commands: {
    help: '--help',
    config: '--config',
    bin: '--bin',
    version: '--version',
    description: '--description',
    repository: '--repository'
  }
};
