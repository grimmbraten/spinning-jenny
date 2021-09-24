const chalk = require('chalk');
const { audit } = require('../common');

const {
  loader,
  stepLabel,
  parseJson,
  scannedDependencies,
  sum,
  colorSize,
  extractAuditSummary
} = require('../helpers');

const scan = async (spinner, hint, target, { verbose, ...config }) => {
  const step = stepLabel(config);

  const [success, response] = await audit(spinner, hint, target, verbose, step);
  if (!success) return response || 'failed to audit package.json';

  const summary = extractAuditSummary(parseJson(response));
  if (!summary) return 'failed to extract audit summary';

  const vulnerabilities = sum(summary.data.vulnerabilities);

  return loader(
    verbose,
    spinner,
    vulnerabilities === 0 ? 'succeed' : 'error',
    vulnerabilities === 0
      ? 'all dependencies are secure'
      : `detected ${colorSize(vulnerabilities, ' vulnerabilities')}`,
    step,
    `${chalk.gray(` scanned ${scannedDependencies(parseJson(response))} dependencies`)}${hint}`
  );
};

module.exports = {
  scan
};
