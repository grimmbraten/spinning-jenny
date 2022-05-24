const { target, config } = require('../mocks');
const { backup } = require('../../src/actions');

jest.mock('../../src/helpers');

const mockRead = jest.fn();
const mockWrite = jest.fn();
jest.mock('../../src/services/json', () => ({
  read: (target, file, resolutions) => mockRead(target, file, resolutions),
  write: (target, file, resolutions) => mockWrite(target, file, resolutions)
}));

const file = 'package.json';
const property = 'resolutions';

const test = async (target, shouldBackup) =>
  await backup(undefined, target, { ...config, backup: shouldBackup });

describe('[actions] backup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('exists with [StatusCode:0] if resolutions exits in target package.json', async () => {
    mockRead.mockReturnValueOnce('project: { resolutions: { "foo": "1.0.0" } }');

    expect(await test(target, true)).toEqual(0);
    expect(mockRead).toHaveBeenCalledTimes(1);
    expect(mockRead).toHaveBeenCalledWith(target, file, property);
    expect(mockWrite).toHaveBeenCalledTimes(1);
  });

  it('exists with [StatusCode:1] if backup property is set to false', async () => {
    expect(await test(undefined, false)).toEqual(1);
    expect(mockWrite).not.toHaveBeenCalled();
  });

  it('exists with [StatusCode:1] if no resolutions exits in target package.json', async () => {
    mockRead.mockReturnValueOnce('');

    expect(await test(target, true)).toEqual(1);
    expect(mockRead).toHaveBeenCalledTimes(1);
    expect(mockRead).toHaveBeenCalledWith(target, file, property);
    expect(mockWrite).not.toHaveBeenCalled();
  });
});
