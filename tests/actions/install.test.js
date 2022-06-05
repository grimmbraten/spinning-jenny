const { config } = require('../mocks');
const { install } = require('../../src/actions');

const mockShell = jest.fn(() => [true, '']);
jest.mock('../../src/services/shelljs', () => ({
  shell: () => mockShell()
}));

const action = async (mockConfig = config) => await install(undefined, undefined, mockConfig);

afterEach(() => {
  jest.clearAllMocks();
});

it('succeeds if installation completes without any issues', async () => {
  mockShell.mockImplementationOnce(() => [true]);
  expect(await action()).toEqual(0);
});

it('skips if config frozen is true', async () => {
  expect(await action({ ...config, frozen: true })).toEqual(1);
});

it('fails if installation encountered an error', async () => {
  mockShell.mockImplementationOnce(() => [false, ['mocked', 'response']]);
  expect(await action()).toEqual(2);
});
