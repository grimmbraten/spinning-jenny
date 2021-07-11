const shell = require("shelljs");

const audit = async (
  callback,
  spinner,
  dir = "~/Documents/github/react-fusion" /* process.cwd() */,
  options = ""
) =>
  shell.exec(
    `yarn --cwd ${dir} audit ${options}`,
    {
      silent: true
    },
    (_, stdout) => callback(stdout, spinner)
  );

module.exports = {
  audit
};
