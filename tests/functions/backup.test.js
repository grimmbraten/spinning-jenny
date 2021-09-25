jest.mock('../../src/common');

const { backup } = require('../../src/functions');
const { errorDir, secureDir, config } = require('../constants');

const { read, write } = require('../../src/common');

describe('backup()', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('skips backup if backup config property is false', async () => {
    const response = await backup('', '', secureDir, config);
    expect(response).toEqual('skipped backup');
  });

  it('skips backup if no resolutions exits in package.json', async () => {
    read.mockImplementationOnce(() => undefined);
    const response = await backup('', '', secureDir, { ...config, backup: true });

    expect(read).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledWith(secureDir, 'package.json', 'resolutions');

    expect(write).not.toHaveBeenCalled();
    expect(response).toEqual('skipped backup');
  });

  it('creates backup if resolutions exits in package.json', async () => {
    read.mockImplementationOnce(() => 'mocked resolutions');
    const response = await backup('', '', errorDir, { ...config, backup: true });

    expect(read).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledWith(errorDir, 'package.json', 'resolutions');

    expect(write).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledWith(errorDir, 'package.json', 'resolutions');
    expect(response).toEqual('created backup');
  });
});
