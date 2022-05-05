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

const findSuccessEvent = json => {
  const count = formatYarnResponse(json)
    .filter(data => data.type === 'success')[1]
    .data?.replace('.', '')
    .split(' ')[1];
  return `upgraded ${count} ${count === 1 ? 'dependency' : 'dependencies'}`;
};

const findWhyTree = json =>
  formatYarnResponse(json).find(({ data }) => !!data.items)?.data?.items || [];

const findAdvisories = json =>
  formatYarnResponse(json)
    .map(({ data, type }) => {
      if (type === 'auditAdvisory')
        return {
          title: data.advisory.title,
          version: data.advisory.findings[0].version,
          module: data.advisory.module_name,
          vulnerableVersions: data.advisory.vulnerable_versions,
          patchedVersions: data.advisory.patched_versions,
          severity: data.advisory.severity,
          url: data.advisory.url,
          recommendation: data.advisory.recommendation.toLowerCase(),
          created: new Date(data.advisory.created).toUTCString(),
          updated: new Date(data.advisory.updated).toUTCString(),
          time: new Date(data.advisory.updated || data.advisory.created).getTime(),
          foundBy: data.advisory.foundBy,
          references: data.advisory.references
        };
    })
    .filter(data => data);

module.exports = {
  reduce,
  findWhyTree,
  parseBoolean,
  findAdvisories,
  findSuccessEvent,
  findAuditSummary,
  countDependencies
};
