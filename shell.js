const shell = require("shelljs");

const test = (option, value) => shell.test(option, value);

const audit = (spinner, hint, target, callback, teardown) => {
  spinner.text = "scanning for vulnerabilities" + hint;

  shell.exec(
    `yarn --cwd ${target} audit --json`,
    {
      silent: true
    },
    (_, stdout) => callback(stdout, spinner, hint, target, teardown)
  );
};

//TODO: add range that can be --caret or --tilde
const upgrade = (spinner, hint, target, callback, range = "") => {
  spinner.text = "upgrading packages" + hint;

  shell.exec(
    `yarn --cwd ${target} upgrade ${range}`,
    {
      silent: true
    },
    (_, stdout) => callback(stdout, spinner, hint, target)
  );
};

const install = (spinner, hint, target) => {
  spinner.text = "install packages" + hint;

  shell.exec(
    `yarn --cwd ${target} install`,
    {
      silent: true
    },
    () => spinner.succeed("installed successfully")
  );
};

module.exports = {
  test,
  audit,
  upgrade,
  install
};
