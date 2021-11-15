const reduce = collection => Object.values(collection).reduce((a, b) => a + b);

const findAuditSummary = json =>
  formatYarnResponse(json).filter(data => data.type === 'auditSummary')[0];

const parseBoolean = value => (value === 'true' ? true : value === 'false' ? false : undefined);

const countDependencies = json => findAuditSummary(json).data.totalDependencies;

const formatYarnResponse = json =>
  json
    .split(/\r?\n/)
    .map(step => (step ? JSON.parse(step) : undefined))
    .filter(data => data);

const findSuccessEvent = json =>
  formatYarnResponse(json)
    .filter(data => data.type === 'success')[1]
    .data?.replace('.', '')
    .replace('S', 's') || undefined;

const findAdvisories = json =>
  formatYarnResponse(json)
    .map(({ data, type }) => {
      if (type === 'auditAdvisory')
        return {
          title: data.advisory.title,
          module: data.advisory.module_name,
          version: data.advisory.vulnerable_versions,
          patched: data.advisory.patched_versions,
          severity: data.advisory.severity,
          url: data.advisory.url
        };
    })
    .filter(data => data);

module.exports = {
  reduce,
  parseBoolean,
  findAdvisories,
  findSuccessEvent,
  findAuditSummary,
  countDependencies
};
