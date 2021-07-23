<img width="100%" src="https://media1.tenor.com/images/5928958c42329cf6e101dda2ad295393/tenor.gif?itemid=7848720" />

<br />

<div align="center">
<a href="https://www.javascript.com/"><img alt="JavaScript" src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/></a>
<a href="https://nodejs.org/en/"><img alt="NodeJS" src="https://img.shields.io/badge/node.js-%2343853D.svg?style=for-the-badge&logo=node-dot-js&logoColor=white"/></a>
<a href="https://github.com/grimmbraten/spinning-jenny"><img alt="GitHub" src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white"/></a>
</div>

<br />

Stop swearing about annoying `yarn audit` issues, say goodbye to manually managing resolutions in your `package.json` file, and instead focus on coding.

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
| --install       | preparatory / teardown | run `yarn install`                                          |
| --upgrade       | preparatory / teardown | run `yarn upgrade` (uses pattern set in the config file)    |
| --original      | preparatory / teardown | apply original resolutions from a saved backup              |
| --audit         | main                   | scan for vulnerabilities and print summary                  |
| --resolve       | main                   | scan for patches and apply necessary resolutions            |
| --path `<path>` | addon                  | target another directory than the current working directory |
| --config        | special                | list personal configuration                                 |
| --backups       | special                | list all saved backups of resolutions                       |

### Events

spinning jenny work consists of five major events executed in a set sequence. Provided flags and variables are read in a specific order (please refer to the example below) and it's therefore important that you understand the order of events to utilize spinning jenny to its full potential.

`special` » `addon` » `preparatory` » `main` » `teardown`

#### Special

Special events can only be executed in isolation, meaning that you can't combine them with other flags in a single command. To utilize a special event flag, please provided it as the first and only flag since they otherwise will be ignored.

#### Preparatory

Flags defined before the main flag will be interpreted as preparatory events. This simply means that they will be executed before the main event.

#### Main

There are currently only two main event flags `--audit` and `--resolve`. These flags can only be combined with preparatory, teardown, and/or addon flags. For example, you can't execute an audit and a resolve in a single command.

#### Teardown

Flags defined after the main flag will be interpreted as teardown events. This means that they will be executed after the main event.

#### Addon

Addon flags can be defined anywhere without changing the behavior. This is because spinning jenny starts by searching for addon flags and interprets them before any other flags, even if the addon flag is defined last.

### Configurations

| Name    | Type    | Default | Description                                        |
| ------- | ------- | ------- | -------------------------------------------------- |
| label   | Boolean | true    | display event counter before messages (true)       |
| pattern | String  | --caret | upgrade restriction (--caret, --tilde, --exact)    |
| backup  | Boolean | true    | create a backup of the resolutions on each command |
| frozen  | Boolean | false   | prevent any modifications to the yarn.lock file    |
| verbose | Boolean | true    | display individual outputs for each event          |

## Uninstall

```bash
yarn global remove spinning-jenny
```

```bash
npm uninstall -g spinning-jenny
```
