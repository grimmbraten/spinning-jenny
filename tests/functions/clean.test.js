jest.mock('../../src/common');

const { clean } = require('../../src/functions');
const { errorDir, secureDir, config } = require('../constants');

const { read, remove } = require('../../src/common');

describe('clean()', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('skips clean if no resolutions exits in package.json', async () => {
    read.mockImplementationOnce(() => undefined);
    const response = await clean('', '', secureDir, config);

    expect(read).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledWith(secureDir, 'package.json', 'resolutions');

    expect(remove).not.toHaveBeenCalled();
    expect(response).toEqual('skipped cleanup');
  });

  it('fails if remove functions returns a falsy response', async () => {
    read.mockImplementationOnce(() => ({ resolutions: '' }));
    remove.mockImplementationOnce(() => false);
    const response = await clean('', '', secureDir, config);

    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith(secureDir, 'package.json', 'resolutions');

    expect(response).toEqual('cleanup failed');
  });

  it('succeeds if resolutions could be removed', async () => {
    read.mockImplementationOnce(() => ({ resolutions: '' }));
    remove.mockImplementationOnce(() => true);
    const response = await clean('', '', secureDir, config);

    expect(read).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledTimes(1);
    expect(response).toEqual('cleaned package.json');
  });
});
