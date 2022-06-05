const { file, target, config } = require('../mocks');
const { backup } = require('../../src/actions');

const mockRead = jest.fn();
const mockWrite = jest.fn();
jest.mock('../../src/services/json', () => ({
  read: (target, file, resolutions) => mockRead(target, file, resolutions),
  write: (target, file, resolutions) => mockWrite(target, file, resolutions)
}));

const action = async (target, shouldBackup) =>
  await backup(undefined, target, { ...config, backup: shouldBackup });

afterEach(() => {
  jest.clearAllMocks();
});

it('succeeds if resolutions exits in target package.json', async () => {
  mockRead.mockReturnValueOnce('project: { resolutions: { "foo": "1.0.0" } }');

  expect(await action(target, true)).toEqual(0);
  expect(mockRead).toHaveBeenCalledTimes(1);
  expect(mockRead).toHaveBeenCalledWith(target, file, 'resolutions');
  expect(mockWrite).toHaveBeenCalledTimes(1);
});

it('skips if backup property is set to false', async () => {
  expect(await action(undefined, false)).toEqual(1);
  expect(mockWrite).not.toHaveBeenCalled();
});

it('skips if no resolutions exits in target package.json', async () => {
  mockRead.mockReturnValueOnce('');

  expect(await action(target, true)).toEqual(1);
  expect(mockRead).toHaveBeenCalledTimes(1);
  expect(mockRead).toHaveBeenCalledWith(target, file, 'resolutions');
  expect(mockWrite).not.toHaveBeenCalled();
});
