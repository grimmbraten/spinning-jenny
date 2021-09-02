const chalk = require('chalk');
const { bin, name, description, version, repository } = require('../../package.json');

const help = (_, inputs) => {
  const alias = Object.keys(bin)[1];
  const trueFalse = `${chalk.green('true')} / ${chalk.red('false')}`;

  if (inputs[1] === 'flags') {
    console.log(
      `\n${chalk.bold.underline('preparatory / teardown')}\n` +
        `\n--clean ${chalk.gray('cleanup pre-existing resolutions')}` +
        `\n--install ${chalk.gray('install dependencies')}` +
        `\n--upgrade ${chalk.gray(
          'upgrade dependencies to their latest version based on the set pattern configuration'
        )}` +
        `\n--backup ${chalk.gray('backup, apply, list, and/or manage resolutions')}`
    );

    console.log(
      `\n${chalk.bold.underline('main')}\n` +
        `\n--scan ${chalk.gray('find modules with known vulnerabilities  ')}` +
        `\n--protect ${chalk.gray('protect modules against known vulnerabilities ')}` +
        `\n--advisories ${chalk.gray(
          'find published advisories for modules with known vulnerabilities'
        )}`
    );

    console.log(
      `\n${chalk.bold.underline('extras')}\n` +
        `\n--directory ${chalk.gray('overwrite current working directory scope')}`
    );

    console.log(
      chalk.gray(
        `\nfor more information, please refer to the documentation\n${repository.url}#flags`
      )
    );
  } else if (inputs[1] === 'usage')
    console.log(
      `\n${chalk.underline('usage examples')}\n\n${alias} --upgrade --scan\n${chalk.gray(
        'upgrade all dependencies following the set upgrade pattern restriction from the configuration file, then scan the package.json file for any vulnerabilities'
      )}\n\n${alias} --clean --protect --install\n${chalk.gray(
        'cleanup any pre-existing resolution, scan package.json file for vulnerabilities and try to protect against them, and lastly execute yarn install'
      )}\n\n${chalk.gray(
        `for more information, please refer to the documentation\n${repository.url}#usage`
      )}`
    );
  else if (inputs[1] === 'config')
    console.log(
      `\n${chalk.underline('configurable properties')}\n\nlabel ${trueFalse}\n${chalk.gray(
        'display action counter'
      )}\n\nbackup ${trueFalse}\n${chalk.gray(
        'save backup of resolutions'
      )}\n\nfrozen ${trueFalse}\n${chalk.gray('prevent yarn.lock modifications')}
        \nverbose ${trueFalse}\n${chalk.gray(`run ${name} verbosely`)}
        \npattern ${chalk.blue('--caret')} / ${chalk.blue('--tilde')} / ${chalk.blue(
        '--exact'
      )}\n${chalk.gray('restrict upgrades to set pattern')}\n\n${chalk.gray(
        `for more information, please refer to the documentation\n${repository.url}#configuration`
      )}`
    );
  else if (inputs[1] === 'commands')
    console.log(
      `\n${chalk.underline('available commands')}\n\nhelp [issue] ${chalk.gray(
        `learn how to use ${name}`
      )}\nconfig [set] ${chalk.gray('list or edit configuration properties')}\n\n${chalk.gray(
        `for more information, please refer to the documentation\n${repository.url}#commands`
      )}`
    );
  else
    console.log(
      `\n${name} ${chalk.gray(version)}\n${description.toLocaleLowerCase()}\n\n${chalk.underline(
        'available cli documentation:'
      )}\n\n${chalk.gray(
        `- ${alias} help flags\n- ${alias} help usage\n- ${alias} help config\n- ${alias} help commands\n\nfor more information, please refer to the documentation\n${repository.url}`
      )}`
    );
};

module.exports = {
  help
};
