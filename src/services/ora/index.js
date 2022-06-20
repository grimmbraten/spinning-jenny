const chalk = require('chalk');

const fail = (spinner, step, hint, message, response) => {
  spinner.fail(step + message + hint);
  if (response && response[1]) console.log(chalk.red(`\n${response[1]}`));

  return 2;
};

const warn = (spinner, step, hint, message, response) => {
  spinner.warn(step + message + hint);
  if (response) console.log(response);

  return 1;
};

const succeed = (spinner, step, hint, message, response) => {
  spinner.succeed(step + message + hint);
  if (response) console.log(response);

  return 0;
};

module.exports = {
  fail,
  warn,
  succeed
};
