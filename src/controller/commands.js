const {
  help,
  bin,
  description,
  repository,
  version,
  view,
  manage,
  commands
} = require('../commands');

const getCommand = inputs => {
  if (commands.bin === inputs[0]) return bin;
  else if (commands.version === inputs[0]) return version;
  else if (commands.description === inputs[0]) return description;
  else if (commands.repository === inputs[0]) return repository;
  else if (commands.help === inputs[0]) return help;
  else if (commands.config === inputs[0])
    if (!inputs[1]) return view;
    else return manage;

  return undefined;
};

module.exports = {
  getCommand
};
