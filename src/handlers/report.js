const chalk = require('chalk');
const {
  sum,
  loader,
  colorSize,
  parseJson,
  severityBadge,
  extractAuditSummary
} = require('../helpers');

const report = (response, spinner, hint, target, { verbose }) => {
  const { data } = extractAuditSummary(parseJson(response));
  const vulnerabilities = sum(data.vulnerabilities);

  if (vulnerabilities === 0)
    return loader(
      verbose,
      spinner,
      'succeed',
      'modules are fully protected against known vulnerabilities',
      '',
      hint
    );

  const {
    vulnerabilities: { critical, high, moderate, low, info }
  } = data;

  const criticalBadge = critical ? severityBadge('critical', critical) : '';
  const highBadge = high ? ' ' + severityBadge('high', high) : '';
  const moderateBadge = moderate ? ' ' + severityBadge('moderate', moderate) : '';
  const lowBadge = low ? ' ' + severityBadge('low', low) : '';
  const infoBadge = info ? ' ' + severityBadge('info', info) : '';

  loader(
    verbose,
    spinner,
    'warn',
    `identified ${colorSize(vulnerabilities, ' vulnerabilities')}`,
    '',
    hint
  );

  console.log(`\n ${criticalBadge}${highBadge}${moderateBadge}${lowBadge}${infoBadge}`);
  console.log(
    `\n${chalk.underline('recommended actions:')}\n\nspinning-jenny --protect\n${chalk.gray(
      'protect modules against known vulnerabilities'
    )}\n\nspinning-jenny --advisories\n${chalk.gray(
      'find published advisories for modules with known vulnerabilities'
    )}`
  );
};

module.exports = {
  report
};
