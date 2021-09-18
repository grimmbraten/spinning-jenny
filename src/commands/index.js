const { help } = require('./help');
const { view, manage } = require('./config');
const { bin, name, version, description, repository } = require('./package');

module.exports = {
  help,
  bin,
  name,
  view,
  manage,
  version,
  description,
  repository,
  commands: {
    help: ['help', '--help'],
    config: ['config', '--config'],
    bin: ['bin', '--bin'],
    name: ['name', '--name'],
    version: ['version', '--version'],
    description: ['description', '--description'],
    repository: ['repository', '--repository']
  }
};
