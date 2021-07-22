<img width="100%" src="https://media1.tenor.com/images/acd0887764b5413605cc658021d73b02/tenor.gif?itemid=14827678" />

<br />

<a href="https://www.javascript.com/"><img alt="JavaScript" src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/></a>
<a href="https://nodejs.org/en/"><img alt="NodeJS" src="https://img.shields.io/badge/node.js-%2343853D.svg?style=for-the-badge&logo=node-dot-js&logoColor=white"/></a>
<a href="https://github.com/grimmbraten/spinning-jenny"><img alt="GitHub" src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white"/></a>

It's time to stop swearing about annoying `yarn audit` issues, say goodbye to manually managing resolutions in your `package.json` file, and focus on your code. It's time, to let **spinning-jenny** resolve vulnerabilities for you.

## Installation

```bash
yarn global add spinning-jenny
```

```bash
npm install -g spinning-jenny
```

## Upgrade

```bash
yarn global upgrade spinning-jenny --latest
```

For more information, please refer to the [yarn documentation](https://classic.yarnpkg.com/en/docs/cli/upgrade).

```bash
npm update -g spinning-jenny
```

For more information, please refer to the [npm documentation](https://docs.npmjs.com/cli/v6/commands/npm-update).

## Usage

```bash
spinning-jenny [...flags]
```

### Flags

| Name            | Event                  | Description                                                 |
| --------------- | ---------------------- | ----------------------------------------------------------- |
| --dry           | preparatory / teardown | remove all pre-existing resolutions                         |
| --revert        | preparatory / teardown | revert to a previously saved resolution backup              |
| --install       | preparatory / teardown | run `yarn install`                                          |
| --upgrade       | preparatory / teardown | run `yarn upgrade` (uses pattern set in the config file)    |
| --audit         | main                   | scan for vulnerabilities and report findings                |
| --twist         | main                   | scan for patches and apply necessary resolutions            |
| --path `<path>` | addon                  | target another directory than the current working directory |
| --config        | special                | show the personal configuration                             |
| --backups       | special                | list projects with backups                                  |

### Events

spinning jenny work consists of five major events executed in a set sequence. Provided flags and variables are read in a specific order (please refer to the example below) and it's therefore important that you understand the order of events to utilize spinning jenny to its full potential.

`special` » `addon` » `preparatory` » `main` » `teardown`

#### Special

Special events can only be executed in isolation, meaning that you can't combine them with other flags in a single command. To utilize a special event flag, please provided it as the first and only flag since they otherwise will be ignored.

#### Preparatory

Flags defined before the main flag will be interpreted as preparatory events. This simply means that they will be executed before the main event.

#### Main

There are currently only two main event flags `--audit` and `--twist`. These flags can only be combined with preparatory, teardown, and/or addon flags. For example, you can't execute an audit and a twist in a single command.

#### Teardown

Flags defined after the main flag will be interpreted as teardown events. This means that they will be executed after the main event.

#### Addon

Addon flags can be defined anywhere without changing the behavior. This is because spinning jenny starts by searching for addon flags and interprets them before any other flags, even if the addon flag is defined last.

### Configurations

| Name    | Type    | Default | Description                                     |
| ------- | ------- | ------- | ----------------------------------------------- |
| label   | Boolean | true    | display step labels before messages (true)      |
| pattern | String  | --caret | upgrade restriction (--caret, --tilde, --exact) |
| backup  | Boolean | true    | create resolutions backups                      |
| frozen  | Boolean | false   | prevent modifications to yarn.lock              |
| verbose | Boolean | true    | display individual steps                        |

## Uninstall

```bash
yarn global remove spinning-jenny
```

```bash
npm uninstall -g spinning-jenny
```
