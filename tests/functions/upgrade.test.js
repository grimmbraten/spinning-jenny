jest.mock('../../src/common');
jest.mock('../../src/helpers/data');

const { upgrade } = require('../../src/functions');
const { errorDir, secureDir, config } = require('../constants');

const { execute } = require('../../src/common');
const { extractUpgradeOutcome } = require('../../src/helpers/data');

describe('upgrade()', () => {
  it('skips install if frozen config property is true', async () => {
    const response = await upgrade('', '', secureDir, { ...config, frozen: true });
    expect(response).toEqual('skipped upgrade');
  });

  it('fails if execute functions respondes with a success false', async () => {
    execute.mockImplementationOnce(() => [false, { data: '' }]);

    const response = await upgrade('', '', secureDir, config);
    expect(response).toEqual('upgrade failed');
  });

  it('fails if it can not extract upgrade outcome', async () => {
    execute.mockImplementationOnce(() => [true, { data: '' }]);
    extractUpgradeOutcome.mockImplementation(() => undefined);

    const response = await upgrade('', '', secureDir, config);
    expect(response).toEqual('upgrade failed');
  });

  it('upgrades dependencies if everything is correct', async () => {
    const mockedResponse = { data: '' };
    execute.mockImplementationOnce(() => [true, mockedResponse]);
    extractUpgradeOutcome.mockImplementation(() => ({
      data: ''
    }));

    const response = await upgrade('', '', secureDir, config);
    expect(response).toEqual(mockedResponse);
  });
});
