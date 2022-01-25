const chalk = require('chalk');

const prefix = ({ label, steps, getStep }) => {
  const step = label ? getStep() : '';
  steps.completed++;
  return step;
};

const verbosely = (message, value, position = 'first') =>
  position === 'last'
    ? console.log(`\n${message}\n`, `${value}\n`)
    : position === 'first'
    ? console.log(`\n\n${message}\n`, value)
    : console.log(`\n${message}\n`, value);

const timely = (spinner, step, message, hint, time) =>
  setTimeout(() => {
    spinner.text = step + message + chalk.gray(` ${hint}`);
  }, time);

module.exports = {
  timely,
  prefix,
  verbosely
};
