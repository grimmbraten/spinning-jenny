const chalk = require('chalk');
const { audit } = require('../common');
const { loader, stepLabel, colorSize, parseJson, severityColor } = require('../helpers');

const advise = async (spinner, hint, target, { verbose, ...config }) => {
  const step = stepLabel(config);
  loader(verbose, spinner, 'start', 'analyzing vulnerabilities', '', hint);

  const [success, response] = await audit(spinner, hint, target, verbose, step);
  if (!success) return;

  const json = parseJson(response);

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

  const unique = [...new Set(advisories.map(advisory => advisory.module))];

  const patches = unique.map(module => advisories.find(advisory => advisory.module === module));
  const patchCount = patches.length;

  if (patchCount === 0) return loader(verbose, spinner, 'warn', 'skipped advise', '', hint);

  patches.forEach(patch => {
    console.log(
      `\n${patch.module}\npatched: ${
        patch.patched !== '<0.0.0'
          ? `${chalk.green('true')} ${chalk.gray(`${patch.version}`)}`
          : chalk.red('false')
      }\nvulnerability: ${severityColor(patch.severity)} ${chalk.gray(
        patch.title.toLowerCase()
      )}\n${chalk.gray(patch.url)}`
    );
  });

  console.log();

  return loader(
    verbose,
    spinner,
    'succeed',
    `located ${colorSize(patchCount, `${patchCount > 1 ? ' advisories' : ' advisory'}`)}`,
    '',
    hint
  );
};

module.exports = {
  advise
};
