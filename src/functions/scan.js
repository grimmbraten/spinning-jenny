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

  if (!success) return;

  const { data } = extractAuditSummary(parseJson(response));
  const vulnerabilities = sum(data.vulnerabilities);

  if (vulnerabilities === 0)
    loader(
      verbose,
      spinner,
      'succeed',
      'all dependencies are secure',
      step,
      `${chalk.gray(` scanned ${scannedDependencies(parseJson(response))} dependencies`)}${hint}`
    );
  else
    loader(
      verbose,
      spinner,
      'error',
      `detected ${colorSize(data.vulnerabilities, ' vulnerabilities')}`,
      step,
      `${chalk.gray(` scanned ${scannedDependencies(parseJson(response))} dependencies`)}${hint}`
    );
};

module.exports = {
  scan
};
