const { clean } = require('../../src/actions');
const { file, target, config } = require('../mocks');

jest.mock('../../src/helpers/output', () => ({
  prefix: () => jest.fn()
}));

const mockRead = jest.fn();
const mockRemove = jest.fn();
jest.mock('../../src/services/json', () => ({
  read: (target, file, resolutions) => mockRead(target, file, resolutions),
  remove: (target, file, resolutions) => mockRemove(target, file, resolutions)
}));

const action = async () => await clean(undefined, target, config);

afterEach(() => {
  jest.clearAllMocks();
});

it('succeeds if resolutions could be removed', async () => {
  mockRead.mockImplementationOnce(() => ({ resolutions: '' }));
  mockRemove.mockImplementationOnce(() => true);
  const response = await action();

  expect(mockRead).toHaveBeenCalledTimes(1);
  expect(mockRemove).toHaveBeenCalledTimes(1);
  expect(response).toEqual(0);
});

it('skips if no resolutions can be found', async () => {
  mockRead.mockImplementationOnce(() => undefined);
  const response = await action();

  expect(mockRead).toHaveBeenCalledTimes(1);
  expect(mockRead).toHaveBeenCalledWith(target, file, 'resolutions');
  expect(mockRemove).not.toHaveBeenCalled();
  expect(response).toEqual(1);
});

it('fails if remove functions returns a falsy response', async () => {
  mockRead.mockImplementationOnce(() => ({ resolutions: '' }));
  mockRemove.mockImplementationOnce(() => false, ['mocked', 'response']);
  const response = await action();

  expect(mockRemove).toHaveBeenCalledTimes(1);
  expect(mockRemove).toHaveBeenCalledWith(target, file, 'resolutions');
  expect(response).toEqual(2);
});
