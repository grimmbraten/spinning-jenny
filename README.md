<img src="https://github.com/grimmbraten/spinning-jenny/blob/master/assets/chain.gif?raw=true" width="100%" />

A cli package.json resolution assistant that helps you with those pesky node package vulnerabilities.

[![Source Quality Assurance](https://github.com/grimmbraten/spinning-jenny/actions/workflows/integrate.yml/badge.svg)](https://github.com/grimmbraten/spinning-jenny/actions/workflows/integrate.yml)

## Install

![npm](https://img.shields.io/npm/v/spinning-jenny?style=flat&color=blue)
![NPM](https://img.shields.io/npm/l/spinning-jenny?style=flat&color=blue)

```bash
yarn global add spinning-jenny
```

```bash
npm install -g spinning-jenny
```

## Upgrade

![npms.io (maintenance)](https://img.shields.io/npms-io/maintenance-score/spinning-jenny?style=flat&color=blue)
![GitHub last commit](https://img.shields.io/github/last-commit/grimmbraten/spinning-jenny?style=flat&color=blue)
![GitHub commits since latest release (by date)](https://img.shields.io/github/commits-since/grimmbraten/spinning-jenny/latest/master?style=flat&color=blue)

```bash
yarn global upgrade spinning-jenny --latest
```

```bash
npm update -g spinning-jenny
```

For more information, please refer to the [npm](https://docs.npmjs.com/cli/v6/commands/npm-update) or [yarn](https://classic.yarnpkg.com/en/docs/cli/upgrade) documentation.

## Usage

```bash
spinning-jenny --help
```

Don't forget to use the help flag if you forget any action syntaxes or available flags to take full advantage of spinning-jenny.

### Actions

<img src="https://github.com/grimmbraten/spinning-jenny/blob/master/assets/patches.gif?raw=true" width="100%" />

spinning-jenny offers a handful of different actions that can help you resolve these pesky package vulnerabilities.

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
audit
</td>
<td>
-a
</td>
<td>
find modules with known vulnerabilities
</td>
</tr>
</tr>

<tr>
<td>
clean
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
fix
</td>
<td>
-f
</td>
<td>
resolve modules with known vulnerabilities
</td>
</tr>

<tr>
<td>
install
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
patches
</td>
<td>
-p
</td>
<td>
find published patch information for modules with known vulnerabilities
</td>
</tr>

<tr>
<td>
restore
</td>
<td>
-r
</td>
<td>
restore saved resolutions for the current directory scope
</td>
</tr>

<tr>
<td>
upgrade
</td>
<td>
-u
</td>
<td>
upgrade dependencies following pattern restriction
</td>
</tr>

</table>

### Flags

<img src="https://github.com/grimmbraten/spinning-jenny/blob/master/assets/flags.gif?raw=true" width="100%" />

Did you know that you can change the behavior of spinning-jenny by including different flags next to your actions?

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
--backup
</td>
<td>
-b
</td>
<td>
save backup of resolutions
</td>
</tr>

<tr>
<td>
--bin
</td>
<td>

</td>
<td>
list available package run aliases
</td>
</tr>

<tr>
<td>
--config
</td>
<td>

</td>
<td>
list/manage package configuration
</td>
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

<tr>
<td>
--frozen
</td>
<td>
-f
</td>
<td>
prevent yarn.lock modifications
</td>
</tr>

<tr>
<td>
--help
</td>
<td>

</td>
<td>
learn more about how to utilize spinning-jenny
</td>
</tr>

<tr>
<td>
--label
</td>
<td>
-l
</td>
<td>
display action counter
</td>
</tr>

<tr>
<td>
--repository
</td>
<td>

</td>
<td>
display the source code repository url
</td>
</tr>

<tr>
<td>
--verbose
</td>
<td>
-v
</td>
<td>
run spinning-jenny verbosely
</td>
</tr>

<tr>
<td>
--version
</td>
<td>

</td>
<td>
display the installed version of spinning-jenny
</td>
</tr>

</table>

## Uninstall

```bash
yarn global remove spinning-jenny
```

```bash
npm uninstall -g spinning-jenny
```

![GitHub Repo stars](https://img.shields.io/github/stars/grimmbraten/spinning-jenny?style=social)
![npm](https://img.shields.io/npm/dt/spinning-jenny?logo=npm&style=social)
