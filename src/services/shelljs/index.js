const shelljs = require('shelljs');

const shell = command =>
  new Promise((resolve, reject) => {
    shelljs.exec(
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
  shell
};
