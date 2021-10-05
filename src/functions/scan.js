const chalk = require('chalk');
const { audit } = require('../common');

const { reduce, loader, prefix, countDependencies, findAuditSummary } = require('../helpers');

const scan = async (spinner, hint, target, { verbose, ...config }) => {
  const step = prefix(config);

  const [success, response] = await audit(spinner, hint, target, verbose, step, '--summary');
  if (!success) return loader(verbose, spinner, 'fail', 'scan failed', step, hint);

  const vulnerabilities = reduce(findAuditSummary(response).data.vulnerabilities);

  return loader(
    verbose,
    spinner,
    vulnerabilities === 0 ? 'succeed' : 'fail',
    vulnerabilities === 0
      ? 'all dependencies are secure'
      : `detected ${vulnerabilities} vulnerabilities`,
    step,
    `${chalk.gray(` scanned ${countDependencies(response)} dependencies`)}${hint}`
  );
};

module.exports = {
  scan
};
