const { getCommand } = require('./commands');
const { getFunctions } = require('./functions');

const interpret = inputs => {
  const command = getCommand(inputs);
  if (command) return { command };

  const { hint, functions, target } = getFunctions(inputs);
  return { hint, functions, target };
};

module.exports = {
  interpret
};
