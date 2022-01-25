const chalk = require('chalk');
const { trueFalse } = require('../constants');
const { bin, name, description, version } = require('../../package.json');

const packageVersion = () => console.log(`\n${name} ${chalk.gray(version)}`);

const help = inputs => {
  const alias = Object.keys(bin)[1];

  const packageInfo = `\n${name} @ ${version}\n${description.toLocaleLowerCase()}\n\n`;

  if (inputs[1] === 'actions')
    console.log(
      `${packageInfo}audit\n${chalk.gray('find modules with known vulnerabilities')}\n` +
        `\nclean\n${chalk.gray('cleanup pre-existing resolutions')}\n` +
        `\nfix\n${chalk.gray('resolve modules with known vulnerabilities')}\n` +
        `\ninstall\n${chalk.gray('install dependencies')}\n` +
        `\npatches\n${chalk.gray(
          'find published patch information for modules with known vulnerabilities'
        )}\n` +
        `\nrestore\n${chalk.gray('restore saved resolutions for the current directory scope')}\n` +
        `\nupgrade\n${chalk.gray('upgrade dependencies following the set pattern restriction')}`
    );
  else if (inputs[1] === 'commands')
    console.log(
      `${packageInfo}alias\n${chalk.gray('list available package aliases')}\n` +
        `\nconfig [properties values]\n${chalk.gray('list/manage package configuration')}\n` +
        `\nhelp [subject]\n${chalk.gray('learn more about how to utilize spinning-jenny')}\n` +
        `\nrepository\n${chalk.gray('display the source code repository url')}\n` +
        `\nversion\n${chalk.gray('display the installed version of spinning-jenny')}`
    );
  else if (inputs[1] === 'flags')
    console.log(
      `${packageInfo}--backup: boolean (default: ${chalk.green('true')})\n${chalk.gray(
        'run/skip backup of resolutions in package.json before first action'
      )}\n` +
        `\n--directory: string\n${chalk.gray(
          'overwrite current working directory scope with a custom path'
        )}\n` +
        `\n--frozen: boolean (default: ${chalk.green('true')})\n${chalk.gray(
          'allow/prevent yarn.lock modifications from action executions'
        )}\n` +
        `\n--label: boolean (default: ${chalk.green('true')})\n${chalk.gray(
          'show/hide the action counter prefix for the loader message'
        )}\n` +
        `\n--verbose: boolean (default: ${chalk.green('true')})\n${chalk.gray(
          'include/exclude detailed outputs from actions'
        )}`
    );
  else if (inputs[1] === 'config')
    console.log(
      `${packageInfo}label:  boolean (${trueFalse})\n${chalk.gray(
        'show/hide the action counter prefix for the loader message'
      )}\n` +
        `\nbackup: boolean (${trueFalse})\n${chalk.gray(
          'run/skip backup of resolutions in package.json before first action'
        )}\n` +
        `\nfrozen: boolean (${trueFalse})\n${chalk.gray(
          'allow/prevent yarn.lock modifications from action executions'
        )}\n` +
        `\nverbose: boolean (${trueFalse})\n${chalk.gray(
          `include/exclude detailed outputs from actions`
        )}\n` +
        `\npattern: distinct value (${chalk.blue('--caret')}, ${chalk.blue(
          '--tilde'
        )}, or ${chalk.blue('--exact')})\n${chalk.gray(
          'specify what upgrade pattern actions should use'
        )}`
    );
  else
    console.log(
      `${packageInfo}${chalk.gray(
        `${alias} <command> | <action [--flags]>\n` +
          `\n${alias} alias` +
          `\n${alias} config` +
          `\n${alias} version` +
          `\n${alias} repository` +
          `\n${alias} help actions` +
          `\n${alias} help commands` +
          `\n${alias} help flags`
      )}`
    );
};

module.exports = {
  help,
  packageVersion
};
