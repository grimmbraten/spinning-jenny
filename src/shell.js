const shell = require('shelljs');
const { colorError } = require('./helpers');

const test = (option, value) => shell.test(option, value);

const execute = command =>
  new Promise((resolve, reject) => {
    shell.exec(
      command,
      {
        silent: true
      },
      (_, stdout, stderr) => {
        if (!stdout || stderr.includes('error')) return reject([false, stderr]);

        resolve([true, stdout]);
      }
    );
  }).catch(error => {
    console.log(`\n${colorError(error)}\n`);
    return [false, error];
  });

module.exports = {
  test,
  execute
};
