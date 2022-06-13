const { fix } = require('../../src/actions');
const { target, config } = require('../mocks');

const mockShell = jest.fn(() => [true, '']);
jest.mock('../../src/services/shelljs', () => ({
  shell: () => mockShell()
}));

const mockRead = jest.fn();
const mockWrite = jest.fn();
jest.mock('../../src/services/json', () => ({
  read: (target, file, resolutions) => mockRead(target, file, resolutions),
  write: (target, file, resolutions) => mockWrite(target, file, resolutions)
}));

const mockReduce = jest.fn();
const mockFindAdvisories = jest.fn();
const mockFindAuditSummary = () => ({ data: 'mocked' });
jest.mock('../../src/helpers', () => ({
  prefix: () => jest.fn(),
  timely: () => jest.fn(),
  reduce: () => mockReduce(),
  randomHold: () => jest.fn(),
  randomFact: () => jest.fn(),
  randomEndgame: () => jest.fn(),
  findAdvisories: () => mockFindAdvisories(),
  findAuditSummary: () => mockFindAuditSummary()
}));

const action = async () => await fix(undefined, target, config);

it('fails if yarn audit encountered an error', async () => {
  mockShell.mockReturnValueOnce([false, ['mocked', 'response']]);
  expect(await action()).toEqual(2);
});

it('fails if no vulnerabilities where found', async () => {
  mockShell.mockReturnValueOnce([true]);
  mockReduce.mockReturnValueOnce(0);
  expect(await action()).toEqual(1);
});

it('it fails if a unsolved advisory is found', async () => {
  mockShell.mockReturnValueOnce([true]);
  mockReduce.mockReturnValueOnce(1);
  mockRead.mockReturnValue([]);
  mockFindAdvisories.mockReturnValueOnce([{ patchedVersions: '<0.0.0' }]);

  expect(await action()).toEqual(2);
});

it('it fails if a unsolved advisory is found', async () => {
  mockShell.mockReturnValueOnce([true]);
  mockReduce.mockReturnValueOnce(1);
  mockRead.mockReturnValue([]);
  mockFindAdvisories.mockReturnValueOnce([
    { module: 'vul1', patchedVersions: '<0.0.0' },
    { module: 'vul2', patchedVersions: '1.0.0' }
  ]);

  expect(await action()).toEqual(1);
});

it('it succeeds if a solved advisory is found and resolved', async () => {
  mockShell.mockReturnValueOnce([true]);
  mockReduce.mockReturnValueOnce(1);
  mockRead.mockReturnValue([]);
  mockFindAdvisories.mockReturnValueOnce([{ patchedVersions: '1.0.0' }]);

  expect(await action()).toEqual(0);
});
