const loader = (verbose, spinner, action, message, step, hint) =>
  verbose && spinner[action](step + message + hint);

const stepLabel = ({ label, steps, getStep }) => {
  if (!label) return '';

  const step = getStep();
  steps.completed++;
  return step;
};

module.exports = {
  loader,
  stepLabel
};
