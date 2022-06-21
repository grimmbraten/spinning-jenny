const parseYarnResponse = json =>
  json
    .split(/\r?\n/)
    .map(step => (step ? JSON.parse(step) : undefined))
    .filter(data => data);

const parseWhy = json =>
  parseYarnResponse(json).find(({ data }) => !!data.items)?.data?.items || [];

const parseVulnerabilities = json =>
  Object.values(
    parseYarnResponse(json).filter(data => data.type === 'auditSummary')[0].data.vulnerabilities
  ).reduce((a, b) => a + b);

const parseAdvisories = json =>
  parseYarnResponse(json)
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
  parseWhy,
  parseAdvisories,
  parseVulnerabilities
};
