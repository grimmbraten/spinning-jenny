const { restore } = require('../../src/actions');
const { file, target, config, resolutions } = require('../mocks');

const mockRead = jest.fn();
const mockWrite = jest.fn();
jest.mock('../../src/services/json', () => ({
  read: (target, file, resolutions) => mockRead(target, file, resolutions),
  write: (target, file, resolutions) => mockWrite(target, file, resolutions)
}));

const action = async () => await restore(undefined, target, config);

it('skips if no resolutions are backed up for provided target', async () => {
  mockRead.mockReturnValueOnce({});
  const response = await action();

  expect(mockWrite).not.toHaveBeenCalled();
  expect(response).toEqual(1);
});

it('succeeds if provided target has backed up resolutions', async () => {
  mockRead.mockReturnValueOnce({ resolutions });
  const response = await action();

  expect(mockWrite).toHaveBeenCalledWith(target, file, { resolutions });
  expect(response).toEqual(0);
});
