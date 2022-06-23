const chalk = require('chalk');

const joke = [
  "February can't March, but April May",
  'I find whiteboards quite re-markable',
  'an explosive monkey is called a baboom',
  "learn sign language, it's pretty handy",
  'seven days without a pun makes one weak',
  "my ceiling isn't the best, but it's up there",
  'never trust an atom, they make up everything',
  "butterflies just aren't what they used to be",
  'getting the ability to fly would be so uplifting',
  'to the guy who invented zero, thanks for nothing.',
  'the guy who invented the door knocker got a no-bell prize'
];

const facts = [
  'a plateau is the highest form of flattery',
  'the first computer virus was created in 1986',
  'the first programming language was called FORTRAN',
  'there are around 700 separate programming languages',
  'the first computer “bug” was an actual real-life bug',
  'the first computer virus was not meant to be harmful',
  'NASA still uses programs from the 70s in their spacecraft'
];

const endgame = [
  'contenplaiting life choises',
  'scouring Stackoverflow for aid',
  'contacting Curiosity for assistance',
  'navigating to the second page of Google search results'
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

const randomJoke = () => joke[Math.floor(Math.random() * joke.length)];

const randomFact = () => `did you know that ${facts[Math.floor(Math.random() * facts.length)]}?`;

const randomEndgame = () => endgame[Math.floor(Math.random() * endgame.length)];

const checkpoints = [
  { time: 750, content: randomFact() },
  { time: 5250, content: randomJoke() },
  { time: 10500, content: randomFact() },
  { time: 15750, content: randomJoke() },
  { time: 21000, content: randomEndgame() }
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

const getPercentageEmoji = percentage =>
  percentage >= 90
    ? '🤩'
    : percentage >= 80
    ? '😁'
    : percentage >= 70
    ? '😄'
    : percentage >= 60
    ? '😇'
    : percentage >= 50
    ? '😌'
    : percentage >= 40
    ? '😕'
    : percentage >= 30
    ? '😔'
    : percentage >= 20
    ? '😦'
    : percentage >= 10
    ? '😨'
    : '😱';

module.exports = {
  timely,
  prefix,
  checkpoints,
  colorProperty,
  colorSeverity,
  emojiSeverity,
  getPercentageEmoji
};
