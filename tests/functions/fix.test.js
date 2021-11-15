jest.mock('../../src/common/audit');
jest.mock('../../src/common/json');
jest.mock('../../src/helpers/data');
const { write } = require('../../src/common/json');
const { audit } = require('../../src/common/audit');
const { reduce, findAdvisories, findAuditSummary } = require('../../src/helpers/data');

const { fix } = require('../../src/functions');
const { target, config, mockedAuditAdvisory } = require('../constants');

const run = async () => await fix(undefined, undefined, target, config);

findAuditSummary.mockImplementation(() => ({
  data: 'mocked'
}));

describe('fix()', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fails if audit scan is unsuccessful', async () => {
    audit.mockImplementationOnce(() => [false]);
    expect(await run()).toEqual('scan failed');
  });

  it('succeeds if package.json contains no vulnerabilities', async () => {
    audit.mockImplementationOnce(() => [true]);
    reduce.mockImplementationOnce(() => 0);

    expect(await run()).toEqual('all dependencies are secure');
  });

  it('fails if audit scan is unsuccessful', async () => {
    audit.mockImplementationOnce(() => [true]);
    reduce.mockImplementationOnce(() => 1);
    findAdvisories.mockImplementationOnce(() => []);

    expect(await run()).toEqual('patching failed');
  });

  it('succeeds if one or more patches are available', async () => {
    audit.mockImplementationOnce(() => [true]);
    reduce.mockImplementationOnce(() => 1);
    findAdvisories.mockImplementationOnce(() => [mockedAuditAdvisory]);

    const response = await run();

    expect(write).toHaveBeenCalledTimes(1);
    expect(response).toEqual('patched known vulnerabilities');
  });
});
