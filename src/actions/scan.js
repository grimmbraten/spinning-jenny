const chalk = require('chalk');
const { audit } = require('../common');

const { reduce, loader, prefix, countDependencies, findAuditSummary } = require('../helpers');

const scan = async (spinner, hint, target, { verbose, ...config }) => {
  const step = prefix(config);

  const [success, response] = await audit(spinner, hint, target, verbose, step, '--summary');
  if (!success) return loader(spinner, 'fail', 'scan failed', step, hint);

  const vulnerabilities = reduce(findAuditSummary(response).data.vulnerabilities);
  const dependencies = countDependencies(response);

  return loader(
    spinner,
    vulnerabilities === 0 ? 'succeed' : 'fail',
    vulnerabilities === 0
      ? 'all dependencies are secure'
      : `detected ${vulnerabilities} ${vulnerabilities > 1 ? 'vulnerabilities' : 'vulnerability'}`,
    step,
    `${chalk.gray(
      ` scanned ${dependencies} ${dependencies > 1 ? 'dependencies' : 'dependency'}`
    )}${hint}`
  );
};

module.exports = {
  scan
};
