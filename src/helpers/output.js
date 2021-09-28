const loader = (verbose, spinner, action, message, step, hint) => {
  if (verbose)
    if (action === 'text') spinner.text = step + message + hint;
    else spinner[action](step + message + hint);

  return message;
};

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
