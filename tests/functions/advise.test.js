jest.mock('../../src/common/audit');
jest.mock('../../src/helpers/data');
const { audit } = require('../../src/common/audit');
const { findAdvisories } = require('../../src/helpers/data');

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
    findAdvisories.mockImplementationOnce(() => []);

    expect(await run()).toEqual('skipped advise');
  });

  it('succeeds if one or more patches are available', async () => {
    audit.mockImplementationOnce(() => [true]);
    findAdvisories.mockImplementationOnce(() => [
      mockedAuditAdvisory,
      { ...mockedAuditAdvisory, module: 'second' }
    ]);

    expect(await run()).toContain('found 2 advisories');
  });

  it('succeeds if one or more patches are available even if no patch is avaiable', async () => {
    audit.mockImplementationOnce(() => [true]);
    findAdvisories.mockImplementationOnce(() => [{ ...mockedAuditAdvisory, patched: '<0.0.0' }]);

    expect(await run()).toContain('found 1 advisory');
  });
});
