jest.mock('../../src/common');
jest.mock('../../src/helpers/data');
const { execute } = require('../../src/common');
const { extractUpgradeOutcome } = require('../../src/helpers/data');

const { upgrade } = require('../../src/functions');
const { target, config } = require('../constants');

const run = async () => await upgrade(undefined, undefined, target, config);

describe('upgrade()', () => {
  it('skips if config frozen property is true', async () => {
    const response = await upgrade(undefined, undefined, target, { ...config, frozen: true });
    expect(response).toEqual('skipped upgrade');
  });

  it('fails if upgrade encountered an error', async () => {
    execute.mockImplementationOnce(() => [false]);
    expect(await run()).toEqual('upgrade failed');
  });

  it('fails if upgrade outcome can not be extracted', async () => {
    execute.mockImplementationOnce(() => [true]);
    extractUpgradeOutcome.mockImplementation(() => undefined);

    expect(await run()).toEqual('upgrade failed');
  });

  it('succeeds if completed without any issues', async () => {
    const mockedResponse = { data: '' };

    execute.mockImplementationOnce(() => [true, mockedResponse]);
    extractUpgradeOutcome.mockImplementation(() => ({
      data: ''
    }));

    expect(await run()).toEqual(mockedResponse);
  });
});
