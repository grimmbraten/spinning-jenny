jest.mock('../../src/common/json');
jest.mock('../../src/helpers/data');
jest.mock('../../src/common/audit');
jest.mock('../../src/helpers/output');

const { fix } = require('../../src/actions');
const { audit } = require('../../src/common/audit');
const { read, write } = require('../../src/common/json');
const { target, config, mockedAuditAdvisory } = require('../constants');
const { reduce, findAdvisories, findAuditSummary } = require('../../src/helpers/data');

const run = async () => await fix(undefined, undefined, target, config);

findAuditSummary.mockImplementation(() => ({
  data: 'mocked'
}));

describe('fix()', () => {
  read.mockImplementation(() => ['data']);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fails if audit scan is unsuccessful', async () => {
    audit.mockImplementationOnce(() => [false]);
    expect(await run()).toEqual(2);
  });

  it('succeeds if package.json contains no vulnerabilities', async () => {
    audit.mockImplementationOnce(() => [true]);
    reduce.mockImplementationOnce(() => 0);

    expect(await run()).toEqual(1);
  });

  it('succeeds if one or more patches are available', async () => {
    audit.mockImplementationOnce(() => [true]);
    reduce.mockImplementationOnce(() => 1);
    findAdvisories.mockImplementationOnce(() => [mockedAuditAdvisory]);

    const response = await run();

    expect(write).toHaveBeenCalledTimes(1);
    expect(response).toEqual(0);
  });
});
