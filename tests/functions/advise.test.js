jest.mock('../../src/common/audit');
jest.mock('../../src/helpers/data');
const { audit } = require('../../src/common/audit');
const { parseJson } = require('../../src/helpers/data');

const { advise } = require('../../src/functions');
const { config, mockedAuditAdvisory } = require('../constants');

const run = async () => await advise(undefined, undefined, undefined, config);

describe('advise()', () => {
  it('fails if audit scan is unsuccessful', async () => {
    audit.mockImplementationOnce(() => [false]);
    expect(await run()).toEqual('scan failed');
  });

  it('skips if no patches are available', async () => {
    audit.mockImplementationOnce(() => [true]);
    parseJson.mockImplementationOnce(() => [{}]);

    expect(await run()).toEqual('skipped advise');
  });

  it('succeeds if one or more patches are available', async () => {
    audit.mockImplementationOnce(() => [true]);
    parseJson.mockImplementationOnce(() => [mockedAuditAdvisory]);

    expect(await run()).toContain('located 1 advisory');
  });
});
