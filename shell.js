const shell = require("shelljs");

//NOTE range can be --caret or --tilde
const upgrade = (callback, spinner, range = "") =>
  shell.exec(
    `yarn --cwd ${dir} upgrade ${range}`,
    {
      silent: true
    },
    (_, stdout) => callback(stdout, spinner)
  );

const test = (option, value) => shell.test(option, value);

const audit = (callback, spinner, target = process.cwd()) =>
  shell.exec(
    `yarn --cwd ${target} audit --json`,
    {
      silent: true
    },
    (_, stdout) => callback(stdout, spinner)
  );

const install = () =>
  shell.exec(`yarn --cwd ${dir} install`, {
    silent: true
  });

module.exports = {
  test,
  audit,
  upgrade,
  install
};
