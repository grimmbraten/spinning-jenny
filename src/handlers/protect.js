const chalk = require('chalk');
const { sum, write, loader, parseJson, extractAuditSummary } = require('../helpers');

const protect = async (response, spinner, hint, target, { verbose }) => {
  const modules = {};
  const json = parseJson(response);
  const { data } = extractAuditSummary(json);
  const vulnerabilities = sum(data.vulnerabilities);

  if (vulnerabilities === 0)
    return loader(verbose, spinner, 'succeed', 'all dependencies are secure', '', hint);

  loader(verbose, spinner, 'start', 'applying patches', '', hint);

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

  if (resolutions.length === 0)
    return loader(verbose, spinner, 'fail', 'patching failed', '', hint);

  resolutions.forEach(({ module, patched }) => {
    modules[module] = patched;
  });

  await write(target, 'package.json', { resolutions: modules });

  loader(verbose, spinner, 'succeed', 'patched known vulnerabilities', '', hint);

  if (noPatch.length > 0)
    loader(
      verbose,
      spinner,
      'succeed',
      `found ${noPatch.length} module${
        noPatch.length > 1 ? 's' : ''
      } without a patch\n\n${chalk.underline(
        'recommended actions:'
      )}\n\nspinning-jenny --advisories${target ? ` --directory ${target}` : ''}`,
      '',
      ''
    );
};

module.exports = {
  protect
};
