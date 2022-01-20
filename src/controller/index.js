const { getActions } = require('./actions');
const { getCommand } = require('./commands');

const interpret = (inputs, fileConfig) => {
  const command = getCommand(inputs);
  if (command) return { command };
  return getActions(inputs, fileConfig);
};

module.exports = {
  interpret
};
