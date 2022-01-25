jest.mock('../../src/common/shell');
jest.mock('../../src/helpers/data');

const { patches } = require('../../src/actions');
const { execute } = require('../../src/common/shell');
const { findAdvisories } = require('../../src/helpers/data');
const { config, mockedAuditAdvisory } = require('../constants');

const run = async () => await patches(undefined, undefined, config);

describe('patches()', () => {
  it('fails if audit scan is unsuccessful', async () => {
    execute.mockImplementationOnce(() => [false]);
    expect(await run()).toEqual(2);
  });

  it('succeeds if one or more patches are available', async () => {
    execute.mockImplementationOnce(() => [true]);
    findAdvisories.mockImplementationOnce(() => [
      mockedAuditAdvisory,
      { ...mockedAuditAdvisory, module: 'second' }
    ]);

    expect(await run()).toEqual(0);
  });

  it('succeeds if one or more patches are available even if no patch is avaiable', async () => {
    execute.mockImplementationOnce(() => [true]);
    findAdvisories.mockImplementationOnce(() => [{ ...mockedAuditAdvisory, patched: '<0.0.0' }]);

    expect(await run()).toEqual(0);
  });
});
