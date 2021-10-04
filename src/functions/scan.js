const chalk = require('chalk');
const { audit } = require('../common');

const {
  sum,
  loader,
  stepLabel,
  parseJson,
  scannedDependencies,
  extractAuditSummary
} = require('../helpers');

const scan = async (spinner, hint, target, { verbose, ...config }) => {
  const step = stepLabel(config);

  const [success, response] = await audit(spinner, hint, target, verbose, step, '--summary');
  if (!success) return loader(verbose, spinner, 'fail', 'scan failed', step, hint);

  const vulnerabilities = sum(extractAuditSummary(parseJson(response)).data.vulnerabilities);

  return loader(
    verbose,
    spinner,
    vulnerabilities === 0 ? 'succeed' : 'fail',
    vulnerabilities === 0
      ? 'all dependencies are secure'
      : `detected ${vulnerabilities} vulnerabilities`,
    step,
    `${chalk.gray(` scanned ${scannedDependencies(parseJson(response))} dependencies`)}${hint}`
  );
};

module.exports = {
  scan
};
