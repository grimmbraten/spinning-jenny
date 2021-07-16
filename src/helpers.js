const parseJson = json =>
  json
    .split(/\r?\n/)
    .map(step => (step ? JSON.parse(step) : undefined))
    .filter(data => data);

const extractAuditSummary = json =>
  json.filter(data => data.type === "auditSummary")[0];

const scannedDependencies = json =>
  json.filter(data => data.type === "auditSummary")[0].data.totalDependencies;

const resolutionCount = resolutions => Object.entries(resolutions).length;

module.exports = {
  parseJson,
  resolutionCount,
  extractAuditSummary,
  scannedDependencies
};
