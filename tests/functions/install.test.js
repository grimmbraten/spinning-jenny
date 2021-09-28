jest.mock('../../src/common');
const { execute } = require('../../src/common');

const { config } = require('../constants');
const { install } = require('../../src/functions');

const run = async (conf = config) => await install(undefined, undefined, undefined, conf);

describe('install()', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('skips install if frozen config property is true', async () => {
    expect(await run({ ...config, frozen: true })).toEqual('skipped install');
  });

  it('fails if execute functions respondes with a success false', async () => {
    execute.mockImplementationOnce(() => [false]);
    expect(await run()).toEqual('installation failed');
  });

  it('succeeds if everything is correct', async () => {
    execute.mockImplementationOnce(() => [true]);
    expect(await run()).toEqual('installed dependencies');
  });
});
