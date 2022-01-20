jest.mock('../../src/common');
const { read, remove } = require('../../src/common');

const { target, config } = require('../constants');
const { clean } = require('../../src/actions');

const file = 'package.json';
const property = 'resolutions';

const run = async () => await clean(undefined, undefined, target, config);

describe('clean()', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('skips if no resolutions can be found', async () => {
    read.mockImplementationOnce(() => undefined);
    const response = await run();

    expect(read).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledWith(target, file, property);
    expect(remove).not.toHaveBeenCalled();
    expect(response).toEqual('skipped cleanup');
  });

  it('fails if remove functions returns a falsy response', async () => {
    read.mockImplementationOnce(() => ({ resolutions: '' }));
    remove.mockImplementationOnce(() => false);
    const response = await run();

    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith(target, file, property);
    expect(response).toEqual('cleanup failed');
  });

  it('succeeds if resolutions could be removed', async () => {
    read.mockImplementationOnce(() => ({ resolutions: '' }));
    remove.mockImplementationOnce(() => true);
    const response = await run();

    expect(read).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledTimes(1);
    expect(response).toEqual('cleaned package.json');
  });
});
