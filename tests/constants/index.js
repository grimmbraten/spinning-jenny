module.exports = {
  target: 'mocked/target/directory/path',
  errorDir: `${__dirname}/../project/error/`,
  secureDir: `${__dirname}/../project/secure/`,
  config: {
    label: false,
    backup: false,
    frozen: false,
    verbose: false,
    pattern: '--caret'
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
    type: 'auditAdvisory',
    data: {
      advisory: {
        title: 'injection vulnerability',
        module_name: 'mockery',
        vulnerable_versions: '2.4.8',
        patched_versions: '2.4.9',
        severity: 'high',
        url: 'https://www.npmjs.com/'
      }
    }
  }
};
