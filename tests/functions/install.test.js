jest.mock('../../src/common');
const { execute } = require('../../src/common');

const { config } = require('../constants');
const { install } = require('../../src/functions');

const run = async (conf = config) => await install(undefined, undefined, undefined, conf);

describe('install()', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('skips if config frozen is true', async () => {
    expect(await run({ ...config, frozen: true })).toEqual('skipped install');
  });

  it('fails if installation encountered an error', async () => {
    execute.mockImplementationOnce(() => [false]);
    expect(await run()).toEqual('installation failed');
  });

  it('succeeds if installation completes without any issues', async () => {
    execute.mockImplementationOnce(() => [true]);
    expect(await run()).toEqual('installed dependencies');
  });
});
