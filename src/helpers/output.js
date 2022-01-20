const loader = (spinner, action, message, step, hint) => {
  if (action === 'text') spinner.text = step + message + hint;
  else spinner[action](step + message + hint);

  return message;
};

const prefix = ({ label, steps, getStep }) => {
  const step = label ? getStep() : '';
  steps.completed++;
  return step;
};

module.exports = {
  loader,
  prefix
};
