jest.mock('../../src/common');
jest.mock('../../src/helpers/output');

const { backup } = require('../../src/actions');
const { target, config } = require('../constants');
const { read, write } = require('../../src/common');

const file = 'package.json';
const property = 'resolutions';

describe('backup()', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('skips if config backup property is false', async () => {
    const response = await backup(undefined, undefined, { ...config, backup: false });
    expect(write).not.toHaveBeenCalled();
    expect(response).toEqual(1);
  });

  it('skips backup if no resolutions exits in package.json', async () => {
    read.mockImplementationOnce(() => undefined);
    const response = await backup(undefined, target, { ...config, backup: true });

    expect(read).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledWith(target, file, property);
    expect(write).not.toHaveBeenCalled();
    expect(response).toEqual(1);
  });

  it('creates backup if resolutions exits in package.json', async () => {
    read.mockImplementationOnce(() => 'mocked');
    const response = await backup(undefined, target, { ...config, backup: true });

    expect(read).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledWith(target, file, property);
    expect(write).toHaveBeenCalledTimes(1);
    expect(response).toEqual(0);
  });
});