const chalk = require('chalk');

const colorProperty = value =>
  typeof value === 'string'
    ? chalk.gray(`${value}`)
    : value
    ? chalk.green(`${value}`)
    : chalk.red(`${value}`);

const colorSeverity = severity =>
  severity === 'critical'
    ? chalk.magenta(severity)
    : severity === 'high'
    ? chalk.red(severity)
    : severity === 'moderate'
    ? chalk.yellow(severity)
    : severity === 'low'
    ? chalk.green(severity)
    : chalk.blue(severity);

module.exports = {
  colorProperty,
  colorSeverity
};
