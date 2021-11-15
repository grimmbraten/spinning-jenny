const { help, bin, repository, version, list, manage, commands } = require('../commands');

const getCommand = inputs => {
  if (commands.bin === inputs[0]) return bin;
  else if (commands.version === inputs[0]) return version;
  else if (commands.repository === inputs[0]) return repository;
  else if (commands.help === inputs[0]) return help;
  else if (commands.config === inputs[0])
    if (!inputs[1]) return list;
    else return manage;

  return undefined;
};

module.exports = {
  getCommand
};
