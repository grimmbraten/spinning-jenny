const { write, audit } = require('../common');
const { reduce, loader, findAuditSummary, findAdvisories, prefix } = require('../helpers');

const fix = async (spinner, hint, target, { verbose, ...config }) => {
  const modules = {};
  const step = prefix(config);

  const [success, response] = await audit(spinner, hint, target, verbose, step);
  if (!success) return loader(verbose, spinner, 'fail', 'scan failed', step, hint);

  const { data } = findAuditSummary(response);
  const vulnerabilities = reduce(data.vulnerabilities);

  if (vulnerabilities === 0)
    return loader(verbose, spinner, 'succeed', 'all dependencies are secure', '', hint);

  loader(verbose, spinner, 'start', 'applying patches', '', hint);

  let advisories = findAdvisories(response);

  advisories = advisories.filter(({ patched }) => patched !== '<0.0.0');

  if (advisories.length === 0) return loader(verbose, spinner, 'fail', 'patching failed', '', hint);

  advisories.forEach(({ module, patched }) => {
    modules[module] = patched;
  });

  await write(target, 'package.json', { resolutions: modules });

  return loader(verbose, spinner, 'succeed', 'patched known vulnerabilities', '', hint);
};

module.exports = {
  fix
};
