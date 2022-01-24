jest.mock('../../src/common');
jest.mock('../../src/helpers/output');

const { config } = require('../constants');
const { execute } = require('../../src/common');
const { install } = require('../../src/actions');

const run = async (mockConfig = config) => await install(undefined, undefined, mockConfig);

describe('install()', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('skips if config frozen is true', async () => {
    expect(await run({ ...config, frozen: true })).toEqual(1);
  });

  it('fails if installation encountered an error', async () => {
    execute.mockImplementationOnce(() => [false]);
    expect(await run()).toEqual(2);
  });

  it('succeeds if installation completes without any issues', async () => {
    execute.mockImplementationOnce(() => [true]);
    expect(await run()).toEqual(0);
  });
});
