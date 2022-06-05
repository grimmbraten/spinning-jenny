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

const action = async () => await audit(undefined, target, config);

it('succeeds if no vulnerabilities are found', async () => {
  mockReduce.mockReturnValueOnce(0);
  mockFindAuditSummary.mockReturnValueOnce(auditSummary);

  expect(await action()).toEqual(0);
});

it('skips if one or more vulnerabilitie(s) are found', async () => {
  mockReduce.mockReturnValueOnce(3);
  mockFindAuditSummary.mockReturnValueOnce(auditSummary);

  expect(await action()).toEqual(1);
});

it('fails if yarn audit is unsuccessful', async () => {
  mockShell.mockReturnValueOnce([false, '']);

  expect(await action()).toEqual(2);
});
