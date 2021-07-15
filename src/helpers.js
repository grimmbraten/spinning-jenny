const parseJson = json =>
  json
    .split(/\r?\n/)
    .map(step => (step ? JSON.parse(step) : undefined))
    .filter(data => data);

module.exports = {
  parseJson
};
