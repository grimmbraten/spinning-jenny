jest.mock('../../src/common/json');

const { restore } = require('../../src/functions');
const { read, write } = require('../../src/common/json');
const { errorDir, secureDir, config } = require('../constants');

describe('restore()', () => {
  it('asd', async () => {
    read.mockImplementationOnce(() => ({}));
    const response = await restore('', '', secureDir, config);
    expect(write).not.toHaveBeenCalled();
    expect(response).toEqual('restoration failed');
  });

  it('asd', async () => {
    read.mockImplementationOnce(() => ({ resolutions: {} }));
    const response = await restore('', '', secureDir, config);
    expect(write).toHaveBeenCalledTimes(1);
    expect(response).toEqual('restored resolutions');
  });
});
