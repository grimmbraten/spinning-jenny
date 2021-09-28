jest.mock('../../src/helpers/data');
jest.mock('../../src/common/json');

const { protect } = require('../../src/functions');
const { write } = require('../../src/common/json');
const { errorDir, secureDir, config } = require('../constants');

const { sum, parseJson, extractAuditSummary } = require('../../src/helpers/data');

extractAuditSummary.mockImplementation(() => ({
  data: ''
}));

describe('protect()', () => {
  it('succeeds if no vulnerabilities are detected', async () => {
    sum.mockImplementationOnce(() => 0);
    const response = await protect('', '', secureDir, config);
    expect(response).toEqual('all dependencies are secure');
  });

  it('fails if no advisory is found', async () => {
    sum.mockImplementationOnce(() => 1);
    parseJson.mockImplementationOnce(() => [{}]);

    const response = await protect('', '', secureDir, config);
    expect(response).toEqual('patching failed');
  });

  it('succeds if advisory is found', async () => {
    sum.mockImplementationOnce(() => 1);
    parseJson.mockImplementationOnce(() => [
      {
        type: 'auditAdvisory',
        data: {
          advisory: {
            title: '',
            module_name: '',
            vulnerable_versions: '',
            patched_versions: '',
            severity: '',
            url: ''
          }
        }
      }
    ]);

    const response = await protect('', '', secureDir, config);
    expect(write).toHaveBeenCalledTimes(1);
    expect(response).toEqual('patched known vulnerabilities');
  });
});
