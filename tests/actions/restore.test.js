const { restore } = require('../../src/actions');

const { target, config, resolutions } = require('../mocks');

const mockRead = jest.fn();
const mockWrite = jest.fn();
jest.mock('../../src/services/json', () => ({
  read: (target, file, resolutions) => mockRead(target, file, resolutions),
  write: (target, file, resolutions) => mockWrite(target, file, resolutions)
}));

const file = 'package.json';

const run = async () => await restore(undefined, target, config);

describe('[actions] restore', () => {
  it('warns if no resolutions are backed up for provided target', async () => {
    mockRead.mockReturnValueOnce({});
    const response = await run();

    expect(mockWrite).not.toHaveBeenCalled();
    expect(response).toEqual(1);
  });

  it('succeeds if provided target has backed up resolutions', async () => {
    mockRead.mockReturnValueOnce({ resolutions });
    const response = await run();

    expect(mockWrite).toHaveBeenCalledWith(target, file, { resolutions });
    expect(response).toEqual(0);
  });
});
