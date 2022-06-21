const { fix } = require('../../src/actions');
const { target, config } = require('../mocks');

const mockInstall = jest.fn(() => [true, '']);
const mockAudit = jest.fn(() => [true, '']);
jest.mock('../../src/services/yarn', () => ({
  audit: () => mockAudit(),
  install: () => mockInstall()
}));

const mockRead = jest.fn();
const mockWrite = jest.fn();
jest.mock('../../src/services/json', () => ({
  read: (target, file, resolutions) => mockRead(target, file, resolutions),
  write: (target, file, resolutions) => mockWrite(target, file, resolutions)
}));

const mockParseAdvisories = jest.fn();
const mockParseVulnerabilities = jest.fn();
jest.mock('../../src/helpers', () => ({
  checkpoints: [],
  prefix: () => jest.fn(),
  timely: () => jest.fn(),
  reduce: () => mockParseVulnerabilities(),
  randomHold: () => jest.fn(),
  randomFact: () => jest.fn(),
  randomEndgame: () => jest.fn(),
  parseAdvisories: () => mockParseAdvisories(),
  parseVulnerabilities: () => mockParseVulnerabilities()
}));

const action = async () => await fix(undefined, target, config);

it('fails if yarn audit encountered an error', async () => {
  mockAudit.mockReturnValueOnce([false, ['mocked', 'response']]);
  expect(await action()).toEqual(2);
});

it('warn if no vulnerabilities where found', async () => {
  mockAudit.mockReturnValueOnce([true]);
  mockParseVulnerabilities.mockReturnValueOnce(0);
  expect(await action()).toEqual(1);
});

it('it fails if a unsolved advisory is found', async () => {
  mockAudit.mockReturnValueOnce([true]);
  mockParseVulnerabilities.mockReturnValueOnce(1);
  mockRead.mockReturnValue([]);
  mockParseAdvisories.mockReturnValueOnce([{ patchedVersions: '<0.0.0' }]);

  expect(await action()).toEqual(2);
});

it('it fails if a unsolved advisory is found', async () => {
  mockAudit.mockReturnValueOnce([true]);
  mockParseVulnerabilities.mockReturnValueOnce(1);
  mockRead.mockReturnValue([]);
  mockParseAdvisories.mockReturnValueOnce([
    { module: 'vul1', patchedVersions: '<0.0.0' },
    { module: 'vul2', patchedVersions: '1.0.0' }
  ]);

  expect(await action()).toEqual(1);
});

it('it succeeds if a solved advisory is found and resolved', async () => {
  mockAudit.mockReturnValueOnce([true]);
  mockParseVulnerabilities.mockReturnValueOnce(1);
  mockRead.mockReturnValue([]);
  mockParseAdvisories.mockReturnValueOnce([{ patchedVersions: '1.0.0' }]);

  expect(await action()).toEqual(0);
});
