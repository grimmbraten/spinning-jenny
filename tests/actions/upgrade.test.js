jest.mock('../../src/common');
jest.mock('../../src/helpers/data');

const { execute } = require('../../src/common');
const { upgrade } = require('../../src/actions');
const { target, config } = require('../constants');
const { findSuccessEvent } = require('../../src/helpers/data');

const run = async () => await upgrade(undefined, target, config);

describe('upgrade()', () => {
  it('skips if config frozen property is true', async () => {
    const response = await upgrade(undefined, target, { ...config, frozen: true });
    expect(response).toEqual(1);
  });

  it('fails if upgrade encountered an error', async () => {
    execute.mockImplementationOnce(() => [false]);
    expect(await run()).toEqual(2);
  });

  it('succeeds if completed without any issues', async () => {
    const mockedResponse = { data: '' };

    execute.mockImplementationOnce(() => [true, mockedResponse]);
    findSuccessEvent.mockImplementation(() => ({
      data: ''
    }));

    expect(await run()).toEqual(0);
  });
});
