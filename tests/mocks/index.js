module.exports = {
  target: 'target/directory/path',
  config: {
    label: false,
    backup: false,
    frozen: false,
    upgrade: true,
    exclude: [],
    steps: {
      completed: 0
    }
  },
  resolutions: {
    module: '^2.1.0',
    package: '^0.7.0',
    dependency: '^1.1.10'
  },
  auditSummary: {
    type: 'auditSummary',
    data: {
      vulnerabilities: { info: 0, low: 1, high: 2 }
    }
  },
  auditAdvisory: {
    title: 'injection vulnerability',
    version: '2.4.8',
    module: 'mockery',
    vulnerableVersions: '<=2.4.8',
    patchedVersions: '>=3.0.2',
    severity: 'high',
    url: 'https://github.com/advisories/MOCK-whgm-m0ck-g3j9',
    recommendation: 'upgrade to version 3.0.2 or later',
    created: 'Thu, 18 Nov 2021 16:00:48 GMT',
    updated: 'Thu, 26 Aug 2021 14:50:46 GMT',
    time: 1629989446000,
    foundBy: undefined,
    references: '- https://github.com/advisories/MOCK-whgm-m0ck-g3j9'
  }
};
