const chalk = require('chalk');

const colorError = err =>
  err
    .replace(/error/g, chalk.red('error'))
    .replace(/warning/g, chalk.yellow('warning'))
    .replace(/Ignoring it./g, chalk.gray('Ignoring it.'));

const colorSize = (count, append = '') => {
  if (count > 25) return chalk.red(`${count}${append}`);
  else if (count > 11) return chalk.yellow(`${count}${append}`);
  else return chalk.green(`${count}${append}`);
};

const colorVariable = value =>
  typeof value === 'string'
    ? chalk.gray(`${value}`)
    : value
    ? chalk.green(`${value}`)
    : chalk.red(`${value}`);

const severityColor = severity => {
  if (severity === 'critical') return chalk.magenta(severity);
  else if (severity === 'high') return chalk.red(severity);
  else if (severity === 'moderate') return chalk.yellow(severity);
  else if (severity === 'low') chalk.green(severity);
  else return chalk.blue(severity);
};

module.exports = {
  colorSize,
  colorError,
  colorVariable,
  severityColor
};
