const shell = require('shelljs');

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
  }).catch(error => [false, error]);

module.exports = {
  execute
};
