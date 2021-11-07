module.exports = {
  target: 'mocked/target/directory/path',
  config: {
    label: false,
    backup: false,
    frozen: false,
    verbose: false,
    pattern: '--caret',
    steps: {
      completed: 0
    }
  },
  mockedResolutions: {
    module: '^2.1.0',
    package: '^0.7.0',
    dependency: '^1.1.10'
  },
  mockedAuditSummary: {
    type: 'auditSummary',
    data: {
      vulnerabilities: { info: 0, low: 1, high: 2 }
    }
  },
  mockedAuditAdvisory: {
    title: 'injection vulnerability',
    module: 'mockery',
    versions: '2.4.8',
    patched: '2.4.9',
    severity: 'high',
    url: 'https://www.npmjs.com/'
  }
};