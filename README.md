<img src="https://github.com/grimmbraten/spinning-jenny/blob/master/assets/demo.gif?raw=true" width="100%" />

A cli assistant that helps you resolve those pesky node module security vulnerabilities

## Install

[![Source Quality Assurance](https://github.com/grimmbraten/spinning-jenny/actions/workflows/integrate.yml/badge.svg)](https://github.com/grimmbraten/spinning-jenny/actions/workflows/integrate.yml)
![npm](https://img.shields.io/npm/dt/spinning-jenny?logo=npm&style=social)
![GitHub Repo stars](https://img.shields.io/github/stars/grimmbraten/spinning-jenny?style=social)

```bash
yarn global add spinning-jenny
```

```bash
npm install -g spinning-jenny
```

## Upgrade

![npm](https://img.shields.io/npm/v/spinning-jenny?style=flat&color=gray)
![npms.io (maintenance)](https://img.shields.io/npms-io/maintenance-score/spinning-jenny?style=flat&color=gray)
![GitHub last commit](https://img.shields.io/github/last-commit/grimmbraten/spinning-jenny?style=flat&color=gray)

```bash
yarn global upgrade spinning-jenny --latest
```

```bash
npm update -g spinning-jenny
```

For more information, please refer to the [npm](https://docs.npmjs.com/cli/v6/commands/npm-update) or [yarn](https://classic.yarnpkg.com/en/docs/cli/upgrade) documentation.

## Usage

### Template

```bash
spinning-jenny <command> | <action(s)> [--flag(s)]
```

### Examples

```bash
spinning-jenny clean fix --upgrade false
```

```bash
spinning-jenny config --frozen false --backup true
```

### Actions

<table>
<tr>
<th align="left" width="204">
Name
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
find potential security vulnerabilities in your dependencies
</td>
</tr>
</tr>

<tr>
<td>
clean
</td>
<td>
remove resolutions from package.json
</td>
</tr>

<tr>
<td>
fix
</td>
<td>
solve potential security vulnerabilities in your dependencies
</td>
</tr>

<tr>
<td>
install
</td>
<td>
install dependencies
</td>
</tr>

<tr>
<td>
advise
</td>
<td>
find published advisories for potential security vulnerabilities in your dependencies
</td>
</tr>

<tr>
<td>
restore
</td>
<td>
apply saved resolution backup from package.json
</td>
</tr>

</table>

### Commands

<table>
<tr>
<th align="left" width="204">
Name
</th>
<th align="left" width="584">
Description
</th>
</tr>

<tr>
<td>
alias
</td>
<td>
print aliases
</td>
</tr>

<tr>
<td>
config
</td>
<td>
print/manage configuration
</td>
</tr>

<tr>
<td>
help
</td>
<td>
open documentation
</td>
</tr>

<tr>
<td>
repository
</td>
<td>
print source code url
</td>
</tr>

<tr>
<td>
version
</td>
<td>
print installed version
</td>
</tr>
</table>

### Flags

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
create resolution backup before first action
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
explicit path to package.json file
</td>
</tr>

<tr>
<td>
--exclude
</td>
<td>
-e
</td>
<td>
exclue modules from being upgraded or resolved
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
--label
</td>
<td>
-l
</td>
<td>
print action step counter prefix
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
upgrade dependencies and development dependencies
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
