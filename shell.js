const shell = require("shelljs");

//NOTE range can be --caret or --tilde
const upgrade = async (callback, spinner, range = "") =>
  shell.exec(
    `yarn --cwd ${dir} upgrade ${range}`,
    {
      silent: true
    },
    (_, stdout) => callback(stdout, spinner)
  );

const test = (option, value) => shell.test(option, value);

const audit = async (callback, spinner, dir = process.cwd(), options = "") =>
  shell.exec(
    `yarn --cwd ${dir} audit ${options}`,
    {
      silent: true
    },
    (_, stdout) => callback(stdout, spinner)
  );

module.exports = {
  test,
  audit,
  upgrade
};
