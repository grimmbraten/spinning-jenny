jest.mock('../../src/helpers/data');
jest.mock('../../src/common/shell');

const { audit } = require('../../src/actions');
const { execute } = require('../../src/common/shell');
const { reduce, findAuditSummary } = require('../../src/helpers/data');
const { target, config, mockedAuditSummary } = require('../constants');

const run = async () => await audit(undefined, target, config);

describe('audit()', () => {
  it('fails if audit scan is unsuccessful', async () => {
    execute.mockImplementationOnce(() => [false]);
    expect(await run()).toEqual(2);
  });

  it('warns if one or more vulnerabilities are found', async () => {
    execute.mockImplementationOnce(() => [true]);
    findAuditSummary.mockImplementationOnce(() => mockedAuditSummary);
    reduce.mockImplementationOnce(() => 3);

    expect(await run()).toEqual(1);
  });

  it('succeeds if no vulnerabilities are found', async () => {
    execute.mockImplementationOnce(() => [true]);
    findAuditSummary.mockImplementationOnce(() => mockedAuditSummary);
    reduce.mockImplementationOnce(() => 0);

    expect(await run()).toEqual(0);
  });
});
