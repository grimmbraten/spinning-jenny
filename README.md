<img width="100%" src="https://media1.tenor.com/images/5928958c42329cf6e101dda2ad295393/tenor.gif?itemid=7848720" />

<br />

<small>A cli package.json resolution assistant that helps you with those pesky yarn audit vulnerabilities.</small>

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

<small>For more information, refer to the [yarn documentation](https://classic.yarnpkg.com/en/docs/cli/upgrade).</small>

```bash
npm update -g spinning-jenny
```

<small>For more information, refer to the [npm documentation](https://docs.npmjs.com/cli/v6/commands/npm-update).</small>

## Usage

```bash
spinning-jenny --upgrade --scan
```

<small>Upgrade all dependencies following the set upgrade pattern restriction from the configuration file, then scan the package.json file for any vulnerabilities.</small>

```bash
spinning-jenny --clean --protect --install
```

<small>Cleanup any pre-existing resolution, scan package.json file for vulnerabilities and try to protect against them, and lastly execute yarn install.</small>

### Preparatory / Teardown

| Name      | Description                                        |
| --------- | -------------------------------------------------- |
| --clean   | cleanup pre-existing resolutions                   |
| --install | install dependencies                               |
| --upgrade | upgrade dependencies following pattern restriction |
| --backup  | backup, list, and/or restore resolutions           |

### Main

| Name         | Description                                                |
| ------------ | ---------------------------------------------------------- |
| --scan       | find modules with known vulnerabilities                    |
| --protect    | protect modules against known vulnerabilities              |
| --advisories | find published advisories for modules with vulnerabilities |

### Extras

| Name        | Description                               |
| ----------- | ----------------------------------------- |
| --directory | overwrite current working directory scope |

### Commands

| Name   | Description                 |
| ------ | --------------------------- |
| set    | edit configuration property |
| config | list current configuration  |
| help   | learns about spinning-jenny |

### Configuration

```json
{
  "label": true,
  "backup": true,
  "frozen": false,
  "verbose": true,
  "pattern": "--caret"
}
```

<small>The JSON object above represents the default configuration file for spinning-jenny.</small>

| Name      | Value                         | Description                      |
| --------- | ----------------------------- | -------------------------------- |
| label     | `true / false`                | display action counter           |
| backup    | `true / false`                | backup pre-existing resolutions  |
| frozen    | `true / false`                | prevent yarn.lock modifications  |
| verbose   | `true / false`                | execute actions verbosely        |
| pattern\* | `--caret / --tilde / --exact` | restrict upgrades to set pattern |

<small>\*For more information about upgrade pattern restrictions, refer to the [yarn documentation](https://classic.yarnpkg.com/en/docs/cli/upgrade/#toc-yarn-upgrade-package-latest-l-caret-tilde-exact-pattern).</small>

## Uninstall

```bash
yarn global remove spinning-jenny
```

```bash
npm uninstall -g spinning-jenny
```
