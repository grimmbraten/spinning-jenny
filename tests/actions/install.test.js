const { config } = require('../mocks');
const { install } = require('../../src/actions');

const mockShell = jest.fn(() => [true, '']);
jest.mock('../../src/services/shelljs', () => ({
  shell: () => mockShell()
}));

const run = async (mockConfig = config) => await install(undefined, undefined, mockConfig);

describe('[actions] install', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('exists with [StatusCode:1] if config frozen is true', async () => {
    expect(await run({ ...config, frozen: true })).toEqual(1);
  });

  it('exists with [StatusCode:2] if installation encountered an error', async () => {
    mockShell.mockImplementationOnce(() => [false, ['mocked', 'response']]);
    expect(await run()).toEqual(2);
  });

  it('exists with [StatusCode:0] if installation completes without any issues', async () => {
    mockShell.mockImplementationOnce(() => [true]);
    expect(await run()).toEqual(0);
  });
});
