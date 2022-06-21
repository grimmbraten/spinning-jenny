const chalk = require('chalk');

const hold = [
  'this may take a while...',
  'please hold...',
  'running asynchronous function...',
  'awaiting completion...'
];

const facts = [
  'the first computer virus was created in 1986',
  'the first programming language was called FORTRAN',
  'NASA still uses programs from the 70s in their spacecraft',
  'the first computer “bug” was an actual real-life bug',
  'the first computer virus was not meant to be harmful',
  'a plateau is the highest form of flattery'
];

const endgame = [
  'how old did you say that this project was again?',
  'establishing contact with Perseverance...',
  'sweeping dust of the source code...',
  'frighteningly looking at the latest change timestamp...',
  'confidently took the lead of this snail race...'
];

const prefix = ({ label, steps, getStep }) => {
  const step = label ? getStep() : '';
  steps.completed++;
  return step;
};

const timely = (spinner, step, message, hint, time) =>
  setTimeout(() => {
    spinner.text = step + message + chalk.gray(` ${hint}`);
  }, time);

const randomHold = () => hold[Math.floor(Math.random() * hold.length)];

const randomFact = () => `did you know that ${facts[Math.floor(Math.random() * facts.length)]}?`;

const randomEndgame = () => endgame[Math.floor(Math.random() * endgame.length)];

const checkpoints = [
  { time: 1000, content: randomHold() },
  { time: 3500, content: randomFact() },
  { time: 7500, content: randomFact() },
  { time: 12500, content: randomFact() },
  { time: 20000, content: randomEndgame() }
];

const colorProperty = value =>
  typeof value === 'string'
    ? chalk.blue(`${value}`)
    : value
    ? chalk.green(`${value}`)
    : chalk.red(`${value}`);

const colorSeverity = severity =>
  severity === 'critical'
    ? chalk.magenta(`(${severity})`)
    : severity === 'high'
    ? chalk.red(`(${severity})`)
    : severity === 'moderate'
    ? chalk.yellow(`(${severity})`)
    : severity === 'low'
    ? chalk.green(`(${severity})`)
    : chalk.blue(`(${severity})`);

const emojiSeverity = severity =>
  severity === 'critical'
    ? '🔥'
    : severity === 'high'
    ? '🚨'
    : severity === 'moderate'
    ? '⚠️ '
    : severity === 'low'
    ? '📬'
    : '📪';

module.exports = {
  timely,
  prefix,
  checkpoints,
  colorProperty,
  colorSeverity,
  emojiSeverity
};
