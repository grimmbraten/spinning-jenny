const { getCommand } = require('./commands');
const { getFunctions } = require('./functions');

const interpret = (inputs, fileConfig) => {
  const command = getCommand(inputs);
  if (command) return { command };

  const { hint, functions, target, config } = getFunctions(inputs, fileConfig);
  return { hint, functions, target, config };
};

module.exports = {
  interpret
};
