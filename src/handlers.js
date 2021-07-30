const chalk = require('chalk');
const {
  sum,
  read,
  write,
  loader,
  parseJson,
  severityBadge,
  colorVariable,
  extractAuditSummary
} = require('./helpers');
const { editConfig } = require('./config');

const emptyArray = 0;

const backups = async () => {
  const backups = await read('./src', '.backups.json');

  Object.keys(backups).forEach(key => {
    console.log(
      chalk.blue(`\n${key}`) +
        ` (${Object.entries(backups[key].resolutions).length} resolutions)` +
        chalk.gray(`\n${backups[key].date}`)
    );
  });
};

const configuration = async (spinner, inputs) => {
  const config = await editConfig(spinner, inputs);

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
    return loader(verbose, spinner, 'succeed', 'could not find any vulnerabilities', '', hint);

  const {
    vulnerabilities: { critical, high, moderate, low, info }
  } = data;

  const criticalBadge = critical ? severityBadge('critical', critical) : '';
  const highBadge = high ? ' ' + severityBadge('high', high) : '';
  const moderateBadge = moderate ? ' ' + severityBadge('moderate', moderate) : '';
  const lowBadge = low ? ' ' + severityBadge('low', low) : '';
  const infoBadge = info ? ' ' + severityBadge('info', info) : '';

  loader(verbose, spinner, 'warn', `found ${vulnerabilities} vulnerabilities`, '', hint);

  console.log(`\n\n${criticalBadge}${highBadge}${moderateBadge}${lowBadge}${infoBadge}`);
};

const resolve = async (response, spinner, hint, target, { verbose }) => {
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

const patches = (response, spinner, hint, target, { verbose }) => {
  const json = parseJson(response);

  loader(verbose, spinner, 'text', 'analyzing vulnerabilities', '', hint);

  const resolutions = json
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

  const unique = [...new Set(resolutions.map(package => package.module))];

  const patches = unique.map(module => resolutions.find(package => package.module === module));

  if (patches.length === emptyArray)
    return loader(verbose, spinner, 'fail', 'failed to analyze vulnerabilities', '', hint);

  loader(
    verbose,
    spinner,
    'succeed',
    `found ${patches.length} module(s) with vulnerabilities`,
    '',
    hint
  );

  patches.forEach(patch => {
    console.log(
      `\n${severityBadge(patch.severity)}\n${patch.module}${chalk.gray(
        `@${patch.version}`
      )}\npatched: ${
        patch.patched !== '<0.0.0' ? chalk.green('true') : chalk.red('false')
      }\nvulnerability: ${patch.title.toLowerCase()}\n${chalk.gray(patch.url)}`
    );
  });
};

module.exports = {
  report,
  resolve,
  backups,
  patches,
  configuration
};
