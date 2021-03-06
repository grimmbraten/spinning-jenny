const { help, bin, repository, version, list, manage, commands } = require('../commands');

const getCommand = inputs => {
  if (commands.alias === inputs[0]) return bin;
  else if (commands.version === inputs[0]) return version;
  else if (commands.repository === inputs[0]) return repository;
  else if (inputs[0].includes('help')) return help;
  else if (commands.config === inputs[0]) return !inputs[1] ? list : manage;

  return undefined;
};

module.exports = {
  getCommand
};
