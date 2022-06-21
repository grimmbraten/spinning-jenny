const { patches } = require('../../src/actions');
const { target, config, auditAdvisory } = require('../mocks');

const mockWhy = jest.fn(() => [{ ...auditAdvisory, why: '' }]);
const mockAudit = jest.fn(() => [true, '']);
jest.mock('../../src/services/yarn', () => ({
  why: () => mockWhy(),
  audit: () => mockAudit()
}));

const mockRead = jest.fn();
jest.mock('../../src/services/json', () => ({
  read: (target, file, resolutions) => mockRead(target, file, resolutions)
}));

const mockParseAdvisories = jest.fn();
jest.mock('../../src/helpers', () => ({
  prefix: () => jest.fn(),
  colorSeverity: () => jest.fn(),
  emojiSeverity: () => jest.fn(),
  parseAdvisories: () => mockParseAdvisories()
}));

const action = async () => await patches(undefined, target, config);

it('fails if yarn audit encountered an error', async () => {
  mockRead.mockReturnValue({});
  mockAudit.mockReturnValueOnce([false, ['mocked', 'response']]);
  expect(await action()).toEqual(2);
});

it('succeeds if yarn audit can produce audit advisories', async () => {
  mockRead.mockReturnValue({});
  mockAudit.mockReturnValueOnce([true]);
  mockParseAdvisories.mockReturnValueOnce([{ patchedVersions: '<0.0.0' }]);

  expect(await action()).toEqual(0);
});
