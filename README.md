<img src="https://raw.githubusercontent.com/grimmbraten/spinning-jenny/master/assets/demo.gif" width="100%" />

A cli package.json resolution assistant that helps you with those pesky yarn audit vulnerabilities.

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

```bash
npm update -g spinning-jenny
```

For more information, please refer to the [npm](https://docs.npmjs.com/cli/v6/commands/npm-update) or [yarn](https://classic.yarnpkg.com/en/docs/cli/upgrade) documentation.

## Usage

```bash
spinning-jenny --upgrade --scan
```

Upgrade all dependencies following the set upgrade pattern restriction from the configuration file, then scan the package.json file for any vulnerabilities.

```bash
spinning-jenny --clean --protect --install
```

Cleanup any pre-existing resolution, scan package.json file for vulnerabilities and try to protect against them, and lastly execute yarn install.

### Flags

#### Preparatory / Teardown

<table>
<tr>
<th align="left" width="204">
Name
</th>
<th align="left" width="104">
Short
</th>
<th align="left" width="584">
Description
</th>
</tr>
<tr>
<td>
--clean
</td>
<td>
-c
</td>
<td>
cleanup pre-existing resolutions
</td>
</tr>
<tr>
<td>
--install
</td>
<td>
-i
</td>
<td>
install dependencies
</td>
</tr>
<tr>
<td>
--upgrade
</td>
<td>
-u
</td>
<td>
upgrade dependencies following pattern restriction
</td>
</tr>
<tr>
<td>
--backup*
</td>
<td>
-b
</td>
<td>
backup, list, and/or restore resolutions
</td>
</tr>
</table>

\*The backup flag can either be used on it's own to trigger a backup save as a preparatory or teardown action. Or it can be used with addons to trigger different actions.

```bash
spinning-jenny --backup restore
```

Restore the saved resolutions for the package.json in the current directory scope as a preparatory or teardown action.

```bash
spinning-jenny --backup list [project-name]
```

List all saved backup or go into detail for a specific saved backup as a special action.

#### Main

<table>
<tr>
<th align="left" width="204">
Name
</th>
<th align="left" width="104">
Short
</th>
<th align="left" width="584">
Description
</th>
</tr>
<tr>
<td>
--scan
</td>
<td>
-s
</td>
<td>
find modules with known vulnerabilities
</td>
</tr>
</tr>
<tr>
<td>
--protect
</td>
<td>
-p
</td>
<td>
protect modules against known vulnerabilities
</td>
</tr>
</tr>
<tr>
<td>
--advisories
</td>
<td>
-a
</td>
<td>
find published advisories for modules with known vulnerabilities
</td>
</tr>
</table>

#### Extras

<table>
<tr>
<th align="left" width="204">
Name
</th>
<th align="left" width="104">
Short
</th>
<th align="left" width="584">
Description
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

<table>
<tr>
<th align="left" width="308">
Name
<th align="left" width="584">
Description
</th>
</tr>
<tr>
<td>
help [issue]
</td>
<td>
learn how to use spinning-jenny
</td>
</tr>
<tr>
<td>
config [set]
</td>
<td>
list or edit configuration properties
</td>
</tr>
</table>

### Configuration

<table>
<tr>
<th align="left" width="104">
Name
</th>
<th align="left" width="244">
Value
</th>
<th align="left" width="544">
Description
</th>
</tr>
<tr>
<td>
label
</td>
<td>
true / false
</td>
<td>
display action counter
</td>
</tr>
<tr>
<td>
backup
</td>
<td>
true / false
</td>
<td>
save backup of resolutions
</td>
</tr>
<tr>
<td>
frozen
</td>
<td>
true / false
</td>
<td>
prevent yarn.lock modifications
</td>
</tr>
<tr>
<td>
verbose
</td>
<td>
true / false
</td>
<td>
run spinning-jenny verbosely
</td>
</tr>
<tr>
<td>
pattern*
</td>
<td>
--caret / --tilde / --exact
</td>
<td>
restrict upgrades to set pattern
</td>
</tr>
</table>

\*For more information about upgrade pattern restrictions, please refer to the [yarn](https://classic.yarnpkg.com/en/docs/cli/upgrade/#toc-yarn-upgrade-package-latest-l-caret-tilde-exact-pattern) documentation.

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
