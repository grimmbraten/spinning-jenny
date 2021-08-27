const chalk = require('chalk');
const {
  sum,
  read,
  write,
  loader,
  colorSize,
  parseJson,
  severityColor,
  severityBadge,
  colorVariable,
  extractAuditSummary
} = require('./helpers');
const { editConfig } = require('./config');
const { bin, name, description, version, repository } = require('../package.json');

const emptyArray = 0;

const backups = async (_, inputs) => {
  const project = inputs[2];
  const backups = await read('./src', '.backups.json');

  if (project) {
    const backup = Object.keys(backups).find(key => key === project);

    if (backup) {
      console.log(`\n${chalk.underline(project)}\n${chalk.gray(backups[backup].date)}\n`);
      console.log(backups[backup].resolutions);
    } else console.log('could not find a backup');
  } else
    Object.keys(backups).forEach((key, index) => {
      console.log(
        `\n${index}. ${key} ${chalk.green(
          `${Object.entries(backups[key].resolutions).length} resolutions`
        )}`
      );
    });
};

const configuration = async spinner => {
  const config = await editConfig(spinner);

  if (config) {
    const keys = Object.keys(config).filter(key => key !== 'steps' && key !== 'getStep');

    console.log();
    keys.forEach(key => {
      console.log(`${key}: ` + colorVariable(config[key]));
    });

    console.log(
      chalk.gray(
        '\nplease refer to the documentation for more information\nhttps://github.com/grimmbraten/spinning-jenny'
      )
    );
  }
};

const report = (response, spinner, hint, target, { verbose }) => {
  const { data } = extractAuditSummary(parseJson(response));
  const vulnerabilities = sum(data.vulnerabilities);

  if (vulnerabilities === emptyArray)
    return loader(verbose, spinner, 'succeed', 'no vulnerabilities found', '', hint);

  const {
    vulnerabilities: { critical, high, moderate, low, info }
  } = data;

  const criticalBadge = critical ? severityBadge('critical', critical) : '';
  const highBadge = high ? ' ' + severityBadge('high', high) : '';
  const moderateBadge = moderate ? ' ' + severityBadge('moderate', moderate) : '';
  const lowBadge = low ? ' ' + severityBadge('low', low) : '';
  const infoBadge = info ? ' ' + severityBadge('info', info) : '';

  loader(
    verbose,
    spinner,
    'warn',
    `encountered ${colorSize(vulnerabilities, ' vulnerabilities')}`,
    '',
    hint
  );

  console.log(`\n ${criticalBadge}${highBadge}${moderateBadge}${lowBadge}${infoBadge}`);
  console.log(
    `\n${chalk.underline('recommended actions after scan:')}${chalk.gray(
      '\n- spinning-jenny --protect\n- spinning-jenny --advisories'
    )}\n`
  );
};

const protect = async (response, spinner, hint, target, { verbose }) => {
  const modules = {};
  const json = parseJson(response);
  const { data } = extractAuditSummary(json);
  const vulnerabilities = sum(data.vulnerabilities);

  if (vulnerabilities === emptyArray)
    return loader(verbose, spinner, 'succeed', 'could not find any vulnerabilities', '', hint);

  loader(verbose, spinner, 'text', 'resolving vulnerabilities', '', hint);

  let resolutions = json
    .map(({ data, type }) => {
      if (type === 'auditAdvisory')
        return {
          title: data.advisory.title,
          module: data.advisory.module_name,
          version: data.advisory.vulnerable_versions,
          patched: data.advisory.patched_versions,
          severity: data.advisory.severity,
          url: data.advisory.url
        };
    })
    .filter(data => data);

  const noPatch = resolutions.filter(({ patched }) => patched === '<0.0.0');
  resolutions = resolutions.filter(({ patched }) => patched !== '<0.0.0');

  if (resolutions.length === emptyArray)
    return loader(verbose, spinner, 'fail', 'failed to resolve vulnerabilities', '', hint);

  resolutions.forEach(({ module, patched }) => {
    modules[module] = patched;
  });

  await write(target, 'package.json', { resolutions: modules });

  loader(verbose, spinner, 'succeed', 'successfully resolved vulnerabilities', '', hint);

  if (noPatch.length > emptyArray)
    loader(
      verbose,
      spinner,
      'succeed',
      `found ${noPatch.length} package(s) without a patch\n\n${chalk.gray(
        `please run ${chalk.white(
          `spinning-jenny --patches${target ? ` --directory ${target}` : ''}`
        )} for more information`
      )}`,
      '',
      ''
    );
};

const advisories = (response, spinner, hint, target, { verbose }) => {
  const json = parseJson(response);

  loader(verbose, spinner, 'text', 'analyzing vulnerabilities', '', hint);

  const advisories = json
    .map(({ data, type }) => {
      if (type === 'auditAdvisory')
        return {
          title: data.advisory.title,
          module: data.advisory.module_name,
          version: data.advisory.vulnerable_versions,
          patched: data.advisory.patched_versions,
          severity: data.advisory.severity,
          url: data.advisory.url
        };
    })
    .filter(data => data);

  const unique = [...new Set(advisories.map(package => package.module))];

  const patches = unique.map(module => advisories.find(package => package.module === module));
  const patchCount = patches.length;

  if (patchCount === emptyArray)
    return loader(verbose, spinner, 'fail', 'failed to analyze vulnerabilities', '', hint);

  loader(
    verbose,
    spinner,
    'succeed',
    `found advisories for ${colorSize(
      patchCount,
      ` module${patchCount > 1 ? 's' : ''}`
    )} with vulnerabilities`,
    '',
    hint
  );

  patches.forEach(patch => {
    console.log(
      `\n${patch.module}${chalk.gray(` @ ${patch.version}`)}\npatched: ${
        patch.patched !== '<0.0.0' ? chalk.green('true') : chalk.red('false')
      }\nseverity: ${severityColor(
        patch.severity
      )}\nvulnerability: ${patch.title.toLowerCase()}\n${chalk.gray(patch.url)}`
    );
  });
};

const help = (_, inputs) => {
  const alias = Object.keys(bin)[2];
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
        `\n--advisories ${chalk.gray('find published advisories for modules with vulnerabilities')}`
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
        'backup pre-existing resolutions'
      )}\n\nfrozen ${trueFalse}\n${chalk.gray('prevent yarn.lock modifications')}
      \nverbose ${trueFalse}\n${chalk.gray('run spinning-jenny verbosely')}
      \npattern ${chalk.blue('--caret')} / ${chalk.blue('--tilde')} / ${chalk.blue(
        '--exact'
      )}\n${chalk.gray('restrict upgrades to set pattern')}\n\n${chalk.gray(
        `for more information, please refer to the documentation\n${repository.url}#configuration`
      )}`
    );
  else if (inputs[1] === 'commands')
    console.log(
      `\n${chalk.underline('available commands')}\n\nset ${chalk.gray(
        'edit configuration property'
      )}\nhelp ${chalk.gray(`learn how to use ${name}`)}\nconfig ${chalk.gray(
        'list current configuration'
      )}\n\n${chalk.gray(
        `for more information, please refer to the documentation\n${repository.url}#commands`
      )}`
    );
  else
    console.log(
      `\n${name} @ ${chalk.gray(version)}\n${description.toLocaleLowerCase()}\n\n${chalk.underline(
        'available cli documentation:'
      )}\n\n${chalk.gray(
        `- ${alias} help flags\n- ${alias} help usage\n- ${alias} help config\n- ${alias} help commands\n\nfor more information, please refer to the documentation\n${repository.url}`
      )}`
    );
};

module.exports = {
  help,
  report,
  protect,
  backups,
  advisories,
  configuration
};
