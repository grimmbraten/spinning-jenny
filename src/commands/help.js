const chalk = require('chalk');
const { bin, name, description, version } = require('../../package.json');

const packageVersion = () => console.log(`\n${name} ${chalk.gray(version)}`);

const help = (_, inputs) => {
  const alias = Object.keys(bin)[1];
  const trueFalse = `${chalk.green('true')} ${chalk.red('false')}`;

  const packageInfo = `\n${name} ${chalk.gray(version)}\n${description.toLocaleLowerCase()}\n\n`;

  if (inputs[1] === 'actions') {
    console.log(
      `${packageInfo}clean ${chalk.gray('cleanup pre-existing resolutions')}` +
        `\nadvise ${chalk.gray(
          'find published advisories for modules with known vulnerabilities'
        )}` +
        `\nclean ${chalk.gray('cleanup pre-existing resolutions')}` +
        `\ninstall ${chalk.gray('install dependencies')}` +
        `\nprotect ${chalk.gray('protect modules against known vulnerabilities')}` +
        `\nrestore ${chalk.gray('restore saved resolutions for the current directory scope')}` +
        `\nscan ${chalk.gray('find modules with known vulnerabilities')}` +
        `\nupgrade ${chalk.gray('upgrade dependencies following pattern restriction')}`
    );
  } else if (inputs[1] === 'flags')
    console.log(
      `${packageInfo}--backup ${chalk.gray('save backup of resolutions')}` +
        `\n--directory ${chalk.gray('overwrite current working directory scope')}` +
        `\n--frozen ${chalk.gray('prevent yarn.lock modifications')}` +
        `\n--label ${chalk.gray('display action counter')}` +
        `\n--verbose ${chalk.gray('run spinning-jenny verbosely')}`
    );
  else if (inputs[1] === 'config')
    console.log(
      `${packageInfo}label [${trueFalse}] ${chalk.gray('display action counter')}` +
        `\nbackup [${trueFalse}] ${chalk.gray('save backup of resolutions')}` +
        `\nfrozen [${trueFalse}] ${chalk.gray('prevent yarn.lock modifications')}` +
        `\nverbose [${trueFalse}] ${chalk.gray(`run ${name} verbosely`)} ` +
        `\npattern [${chalk.blue('--caret')} ${chalk.blue('--tilde')} ${chalk.blue(
          '--exact'
        )}] ${chalk.gray('restrict upgrades to set pattern')}`
    );
  else
    console.log(
      `${packageInfo}${chalk.gray(
        `${alias} --bin` +
          `\n${alias} --config` +
          `\n${alias} --repository` +
          `\n${alias} --version` +
          `\n${alias} --help actions` +
          `\n${alias} --help flags`
      )}`
    );
};

module.exports = {
  help,
  packageVersion
};
