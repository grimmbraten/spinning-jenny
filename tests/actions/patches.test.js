const { patches } = require('../../src/actions');
const { target, config } = require('../mocks');

const mockShell = jest.fn(() => [true, '']);
jest.mock('../../src/services/shelljs', () => ({
  shell: () => mockShell()
}));

const mockRead = jest.fn();
jest.mock('../../src/services/json', () => ({
  read: (target, file, resolutions) => mockRead(target, file, resolutions)
}));

const mockFindAdvisories = jest.fn();
jest.mock('../../src/helpers', () => ({
  prefix: () => jest.fn(),
  colorSeverity: () => jest.fn(),
  findAdvisories: () => mockFindAdvisories()
}));

const action = async () => await patches(undefined, target, config);

it('fails if yarn audit encountered an error', async () => {
  mockRead.mockReturnValue({});
  mockShell.mockReturnValueOnce([false, ['mocked', 'response']]);
  expect(await action()).toEqual(2);
});

it('yes', async () => {
  mockRead.mockReturnValue({});
  mockShell.mockReturnValueOnce([true]);
  mockFindAdvisories.mockReturnValueOnce([{ patchedVersions: '<0.0.0' }]);

  expect(await action()).toEqual(0);
});
