<img width="100%" src="https://media1.tenor.com/images/acd0887764b5413605cc658021d73b02/tenor.gif?itemid=14827678" />

<br />

<a href="https://www.javascript.com/"><img alt="JavaScript" src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/></a>
<a href="https://nodejs.org/en/"><img alt="NodeJS" src="https://img.shields.io/badge/node.js-%2343853D.svg?style=for-the-badge&logo=node-dot-js&logoColor=white"/></a>
<a href="https://github.com/grimmbraten/spinning-jenny"><img alt="GitHub" src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white"/></a>

It's time to stop swearing about annoying yarn audit issues and let **spinning-jenny** resolve the vulnerabilities for you. This package is still in early development, so expect bugs and use with caution.

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

> Good to know, globally installed packages are treated as if they are installed with a caret semver range specified. So if you require to update to the latest (breaking changes version) you may need to `run npm install -g <package>`.

For more information, please refer to the [npm documentation](https://docs.npmjs.com/cli/v6/commands/npm-update).

## Usage

```bash
spinning-jenny [...flag]
```

### Flags

| Name                       | Short                  | Description                                                                                                                    |
| -------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| --dry                      | -d                     | tells Jenny to remove all pre-existing resolutions from the package.json file                                                  |
| --install                  | -i                     | tells Jenny to run `yarn install` after a twist                                                                                |
| --audit                    | -a                     | tells Jenny to print a vulnerability report for the package.json file                                                          |
| --twist                    | -t                     | tells Jenny to scan for vulnerabilities, search for patched versions, and apply necessary resolutions to the package.json file |
| --path `<path/to/project>` | -p `<path/to/project>` | tells Jenny to search for the package.json file in another directory than the cwd                                              |

## Uninstall

```bash
yarn global remove spinning-jenny
```

```bash
npm uninstall -g spinning-jenny
```
