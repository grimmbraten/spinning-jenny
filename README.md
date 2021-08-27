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

### Flags

#### Preparatory / Teardown

| Name      | Short | Description                                        |
| --------- | ----- | -------------------------------------------------- |
| --clean   | -d    | cleanup pre-existing resolutions                   |
| --install | -i    | install dependencies                               |
| --upgrade | -u    | upgrade dependencies following pattern restriction |
| --backup  | -b    | backup, list, and/or restore resolutions           |

#### Main

| Name         | Short | Description                                                |
| ------------ | ----- | ---------------------------------------------------------- |
| --scan       | -s    | find modules with known vulnerabilities                    |
| --protect    | -p    | protect modules against known vulnerabilities              |
| --advisories | -a    | find published advisories for modules with vulnerabilities |

#### Extras

<table>
<tr>
<th>
<img width="204" height="1">
<p> 
Name
</p>
</th>
<th>
<img width="104" height="1">
<p> 
  Short
</p>
</th>
<th>
<img width="584" height="1">
<p> 
  Description
</p>
</th>
</tr>
<tr>
<td>
--directory
</td>
<td>
-d
</td>
<td>
overwrite current working directory scope
</td>
</tr>
</table>

#### Commands

| Name   | Description                     |
| ------ | ------------------------------- |
| set    | edit configuration property     |
| help   | learn how to use spinning-jenny |
| config | list current configuration      |

### Configuration

| Name      | Value                         | Description                      |
| --------- | ----------------------------- | -------------------------------- |
| label     | `true / false`                | display action counter           |
| backup    | `true / false`                | backup pre-existing resolutions  |
| frozen    | `true / false`                | prevent yarn.lock modifications  |
| verbose   | `true / false`                | run spinning-jenny verbosely     |
| pattern\* | `--caret / --tilde / --exact` | restrict upgrades to set pattern |

\*For more information about upgrade pattern restrictions, please refer to the [yarn documentation](https://classic.yarnpkg.com/en/docs/cli/upgrade/#toc-yarn-upgrade-package-latest-l-caret-tilde-exact-pattern).

#### Default configuration

```json
{
  "label": true,
  "backup": true,
  "frozen": false,
  "verbose": true,
  "pattern": "--caret"
}
```

## Uninstall

```bash
yarn global remove spinning-jenny
```

```bash
npm uninstall -g spinning-jenny
```
