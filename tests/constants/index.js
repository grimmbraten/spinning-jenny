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
