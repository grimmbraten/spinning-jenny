const { clean } = require('../../src/actions');
const { target, config } = require('../mocks');

jest.mock('../../src/helpers/output', () => ({
  prefix: () => jest.fn()
}));

const mockRead = jest.fn();
const mockRemove = jest.fn();
jest.mock('../../src/services/json', () => ({
  read: (target, file, resolutions) => mockRead(target, file, resolutions),
  remove: (target, file, resolutions) => mockRemove(target, file, resolutions)
}));

const file = 'package.json';
const property = 'resolutions';

const run = async () => await clean(undefined, target, config);

describe('[actions] clean', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('exists with [StatusCode:1] if no resolutions can be found', async () => {
    mockRead.mockImplementationOnce(() => undefined);
    const response = await run();

    expect(mockRead).toHaveBeenCalledTimes(1);
    expect(mockRead).toHaveBeenCalledWith(target, file, property);
    expect(mockRemove).not.toHaveBeenCalled();
    expect(response).toEqual(1);
  });

  it('exists with [StatusCode:2] if remove functions returns a falsy response', async () => {
    mockRead.mockImplementationOnce(() => ({ resolutions: '' }));
    mockRemove.mockImplementationOnce(() => false);
    const response = await run();

    expect(mockRemove).toHaveBeenCalledTimes(1);
    expect(mockRemove).toHaveBeenCalledWith(target, file, property);
    expect(response).toEqual(2);
  });

  it('exists with [StatusCode:0] if resolutions could be removed', async () => {
    mockRead.mockImplementationOnce(() => ({ resolutions: '' }));
    mockRemove.mockImplementationOnce(() => true);
    const response = await run();

    expect(mockRead).toHaveBeenCalledTimes(1);
    expect(mockRemove).toHaveBeenCalledTimes(1);
    expect(response).toEqual(0);
  });
});
