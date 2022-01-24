jest.mock('../../src/common/audit');
jest.mock('../../src/helpers/data');

const { scan } = require('../../src/actions');
const { audit } = require('../../src/common/audit');
const { reduce, findAuditSummary } = require('../../src/helpers/data');
const { target, config, mockedAuditSummary } = require('../constants');

const run = async () => await scan(undefined, target, config);

describe('scan()', () => {
  it('fails if audit scan is unsuccessful', async () => {
    audit.mockImplementationOnce(() => [false]);
    expect(await run()).toEqual(2);
  });

  it('warns if one or more vulnerabilities are found', async () => {
    audit.mockImplementationOnce(() => [true]);
    findAuditSummary.mockImplementationOnce(() => mockedAuditSummary);
    reduce.mockImplementationOnce(() => 3);

    expect(await run()).toEqual(1);
  });

  it('succeeds if no vulnerabilities are found', async () => {
    audit.mockImplementationOnce(() => [true]);
    findAuditSummary.mockImplementationOnce(() => mockedAuditSummary);
    reduce.mockImplementationOnce(() => 0);

    expect(await run()).toEqual(0);
  });
});
