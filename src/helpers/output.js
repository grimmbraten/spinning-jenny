const prefix = ({ label, steps, getStep }) => {
  const step = label ? getStep() : '';
  steps.completed++;
  return step;
};

const verbosely = (message, value, position = 'first') =>
  position === 'first'
    ? console.log(`\n${message}\n`, value)
    : console.log(`\n${message}\n`, `${value}\n`);

module.exports = {
  prefix,
  verbosely
};
