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

  if (vulnerabilities === 0)
    return loader(
      verbose,
      spinner,
      'succeed',
      'all dependencies are secure',
      step,
      `${chalk.gray(` scanned ${scannedDependencies(parseJson(response))} dependencies`)}${hint}`
    );
  else
    return loader(
      verbose,
      spinner,
      'error',
      `detected ${colorSize(vulnerabilities, ' vulnerabilities')}`,
      step,
      `${chalk.gray(` scanned ${scannedDependencies(parseJson(response))} dependencies`)}${hint}`
    );
};

module.exports = {
  scan
};
