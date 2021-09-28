const { write, audit } = require('../common');
const { sum, loader, parseJson, extractAuditSummary, stepLabel } = require('../helpers');

const protect = async (spinner, hint, target, { verbose, ...config }) => {
  const modules = {};
  const step = stepLabel(config);

  const [success, response] = await audit(spinner, hint, target, verbose, step);
  if (!success) return loader(verbose, spinner, 'fail', 'scan failed', step, hint);

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

  resolutions = resolutions.filter(({ patched }) => patched !== '<0.0.0');

  if (resolutions.length === 0)
    return loader(verbose, spinner, 'fail', 'patching failed', '', hint);

  resolutions.forEach(({ module, patched }) => {
    modules[module] = patched;
  });

  await write(target, 'package.json', { resolutions: modules });

  return loader(verbose, spinner, 'succeed', 'patched known vulnerabilities', '', hint);
};

module.exports = {
  protect
};
