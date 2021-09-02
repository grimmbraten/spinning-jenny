const chalk = require('chalk');
const { loader, colorSize, parseJson, severityColor } = require('../helpers');

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

  if (patchCount === 0)
    return loader(verbose, spinner, 'fail', 'failed to analyze vulnerabilities', '', hint);

  loader(
    verbose,
    spinner,
    'succeed',
    `found advisories for ${colorSize(
      patchCount,
      ` module${patchCount > 1 ? 's' : ''}`
    )} with known vulnerabilities`,
    '',
    hint
  );

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
};

module.exports = {
  advisories
};
