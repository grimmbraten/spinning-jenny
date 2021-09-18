const {
  help,
  bin,
  name,
  description,
  repository,
  version,
  view,
  manage,
  commands
} = require('../commands');

const getCommand = inputs => {
  if (commands.bin.includes(inputs[0])) return bin;
  else if (commands.name.includes(inputs[0])) return name;
  else if (commands.version.includes(inputs[0])) return version;
  else if (commands.description.includes(inputs[0])) return description;
  else if (commands.repository.includes(inputs[0])) return repository;
  else if (commands.help.includes(inputs[0])) return help;
  else if (commands.config.includes(inputs[0]))
    if (inputs[1] === 'set') return manage;
    else return view;

  return undefined;
};

module.exports = {
  getCommand
};
