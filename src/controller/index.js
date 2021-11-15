const { getCommand } = require('./commands');
const { getFunctions } = require('./functions');

const interpret = (inputs, fileConfig) => {
  const command = getCommand(inputs);
  if (command) return { command };

  const { hint, bail, functions, target, config } = getFunctions(inputs, fileConfig);
  return { hint, bail, functions, target, config };
};

module.exports = {
  interpret
};
