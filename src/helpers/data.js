const sum = collection => Object.values(collection).reduce((a, b) => a + b);

const parseJson = json =>
  json
    .split(/\r?\n/)
    .map(step => (step ? JSON.parse(step) : undefined))
    .filter(data => data);

const extractAuditSummary = json => json.filter(data => data.type === 'auditSummary')[0];

const extractUpgradeOutcome = json => {
  const outcome = json.filter(data => data.type === 'success')[1].data;

  return !outcome ? undefined : outcome.replace('.', '').replace('S', 's');
};

const scannedDependencies = json =>
  json.filter(data => data.type === 'auditSummary')[0].data.totalDependencies;

const isBooleanInput = value => (value === 'true' ? true : value === 'false' ? false : undefined);

module.exports = {
  sum,
  parseJson,
  isBooleanInput,
  extractAuditSummary,
  scannedDependencies,
  extractUpgradeOutcome
};
