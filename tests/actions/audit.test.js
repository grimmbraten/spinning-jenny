const { audit } = require('../../src/actions/audit');
const { target, config, auditSummary } = require('../mocks');

const mockShell = jest.fn(() => [true, '']);
jest.mock('../../src/services/shelljs', () => ({
  shell: () => mockShell()
}));

const mockReduce = jest.fn();
const mockFindAuditSummary = jest.fn();
jest.mock('../../src/helpers/data', () => ({
  reduce: () => mockReduce(),
  prefix: () => jest.fn(),
  findAuditSummary: () => mockFindAuditSummary()
}));

const test = async () => await audit(undefined, target, config);

describe('[actions] audit', () => {
  it('exits with status code 0 if no vulnerabilities are found', async () => {
    mockReduce.mockReturnValueOnce(0);
    mockFindAuditSummary.mockReturnValueOnce(auditSummary);

    expect(await test()).toEqual(0);
  });

  it('exits with status code 2 if yarn audit is unsuccessful', async () => {
    mockShell.mockReturnValueOnce([false, '']);

    expect(await test()).toEqual(2);
  });

  it('exits with status code 3 if one or more vulnerabilitie(s) are found', async () => {
    mockReduce.mockReturnValueOnce(3);
    mockFindAuditSummary.mockReturnValueOnce(auditSummary);

    expect(await test()).toEqual(1);
  });
});
