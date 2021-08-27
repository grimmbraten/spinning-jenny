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
--backup
</td>
<td>
-b
</td>
<td>
backup, list, and/or restore resolutions
</td>
</tr>
</table>

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
find published advisories for modules with vulnerabilities
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
set
</td>
<td>
edit configuration property
</td>
</tr>
<tr>
<td>
help
</td>
<td>
learn how to use spinning-jenny
</td>
</tr>
<tr>
<td>
config
</td>
<td>
list current configuration
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
backup pre-existing resolutions
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
