jest.mock('../../src/common/json');
jest.mock('../../src/helpers/data');
jest.mock('../../src/common/shell');
jest.mock('../../src/helpers/output');

const { fix } = require('../../src/actions');
const { execute } = require('../../src/common/shell');
const { read, write } = require('../../src/common/json');
const { target, config, mockedAuditAdvisory, mockedAuditSummary } = require('../constants');
const { reduce, findAdvisories, findAuditSummary } = require('../../src/helpers/data');

const run = async () => await fix(undefined, undefined, target, config);

describe('fix()', () => {
  read.mockImplementation(() => ['data']);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fails if audit scan is unsuccessful', async () => {
    execute.mockImplementationOnce(() => [false]);
    expect(await run()).toEqual(2);
  });

  it('succeeds if package.json contains no vulnerabilities', async () => {
    execute.mockImplementationOnce(() => [true]);
    reduce.mockImplementationOnce(() => 0);
    findAuditSummary.mockImplementationOnce(() => mockedAuditSummary);

    expect(await run()).toEqual(1);
  });

  it('succeeds if one or more patches are available', async () => {
    execute.mockImplementation(() => [true]);
    reduce.mockImplementationOnce(() => 1);
    findAuditSummary.mockImplementationOnce(() => mockedAuditSummary);
    findAdvisories.mockImplementationOnce(() => [mockedAuditAdvisory]);

    const response = await run();

    expect(write).toHaveBeenCalledTimes(1);
    expect(response).toEqual(0);
  });
});
