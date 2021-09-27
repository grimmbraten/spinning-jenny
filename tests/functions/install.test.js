jest.mock('../../src/common');
jest.mock('../../src/helpers/data');

const { install } = require('../../src/functions');
const { errorDir, secureDir, config } = require('../constants');

const { execute } = require('../../src/common');

describe('install()', () => {
  it('skips install if frozen config property is true', async () => {
    const response = await install('', '', secureDir, { ...config, frozen: true });
    expect(response).toEqual('skipped install');
  });

  it('fails if execute functions respondes with a success false', async () => {
    execute.mockImplementationOnce(() => [false]);

    const response = await install('', '', secureDir, config);
    expect(response).toEqual('installation failed');
  });

  it('succeeds if everything is correct', async () => {
    execute.mockImplementationOnce(() => [true]);

    const response = await install('', '', secureDir, config);
    expect(response).toEqual('installed dependencies');
  });
});
