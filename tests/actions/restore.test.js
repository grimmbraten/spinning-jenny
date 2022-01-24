jest.mock('../../src/common/json');

const { restore } = require('../../src/actions');
const { read, write } = require('../../src/common/json');
const { target, config, mockedResolutions } = require('../constants');

const file = 'package.json';

const run = async () => await restore(undefined, target, config);

describe('restore()', () => {
  it('warns if no resolutions are backed up for provided target', async () => {
    read.mockImplementationOnce(() => ({}));
    const response = await run();

    expect(write).not.toHaveBeenCalled();
    expect(response).toEqual(1);
  });

  it('succeeds if provided target has backed up resolutions', async () => {
    read.mockImplementationOnce(() => ({ resolutions: mockedResolutions }));
    const response = await run();

    expect(write).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenCalledWith(target, file, { resolutions: mockedResolutions });
    expect(response).toEqual(0);
  });
});
