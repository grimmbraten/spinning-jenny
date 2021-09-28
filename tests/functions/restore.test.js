jest.mock('../../src/common/json');
const { read, write } = require('../../src/common/json');

const { target, config, mockedResolutions } = require('../constants');
const { restore } = require('../../src/functions');

const file = 'package.json';

const run = async () => await restore(undefined, undefined, target, config);

describe('restore()', () => {
  it('fails if no resolutions are backed up for provided target', async () => {
    read.mockImplementationOnce(() => ({}));
    const response = await run();

    expect(write).not.toHaveBeenCalled();
    expect(response).toEqual('restoration failed');
  });

  it('succeeds if provided target has backed up resolutions', async () => {
    read.mockImplementationOnce(() => ({ resolutions: mockedResolutions }));
    const response = await run();

    expect(write).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenCalledWith(target, file, { resolutions: mockedResolutions });
    expect(response).toEqual('restored resolutions');
  });
});
