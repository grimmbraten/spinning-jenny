const { audit } = require('../../src/actions/audit');
const { target, config } = require('../mocks');

const mockAudit = jest.fn(() => [true, '']);
jest.mock('../../src/services/yarn', () => ({
  audit: () => mockAudit()
}));

const mockParseVulnerabilities = jest.fn();
jest.mock('../../src/helpers', () => ({
  prefix: () => jest.fn(),
  parseVulnerabilities: () => mockParseVulnerabilities()
}));

const action = async () => await audit(undefined, target, config);

it('succeeds if no vulnerabilities are found', async () => {
  mockParseVulnerabilities.mockReturnValueOnce(0);

  expect(await action()).toEqual(0);
});

it('succeeds if one vulnerability is found', async () => {
  mockParseVulnerabilities.mockReturnValueOnce(1);

  expect(await action()).toEqual(1);
});

it('succeeds if several vulnerabilities are found', async () => {
  mockParseVulnerabilities.mockReturnValueOnce(3);

  expect(await action()).toEqual(1);
});

it('fails if yarn audit is unsuccessful', async () => {
  mockAudit.mockReturnValueOnce([false, ['mocked', 'response']]);

  expect(await action()).toEqual(2);
});
