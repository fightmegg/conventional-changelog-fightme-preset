# CC FightMe Preset

[![Version](https://img.shields.io/npm/v/@fightmegg/conventional-changelog-fightme-preset.svg)](https://www.npmjs.com/package/@fightmegg/conventional-changelog-fightme-preset)
[![Downloads](https://img.shields.io/npm/dm/@fightmegg/conventional-changelog-fightme-preset.svg)](https://www.npmjs.com/package/@fightmegg/conventional-changelog-fightme-preset)
[![CircleCI](https://circleci.com/gh/fightmegg/conventional-changelog-fightme-preset/tree/master.svg?style=svg)](https://circleci.com/gh/fightmegg/conventional-changelog-fightme-preset/tree/master)

> A custom FightMe Preset for [Conventional Changelog](https://github.com/conventional-changelog/conventional-changelog)

## Installation

`npm install @fightmegg/conventional-changelog-fightme-preset`

## Usage

```js
import conventionalChangelogCore from 'conventional-changelog-core'
import fightmePreset from '@fightmegg/conventional-changelog-fightme-preset'

conventionalChangelogCore({
    config: fightmePreset
}).pipe(...);
```

## Supported Commit Types

- `feat` -> `Features`
- `fix` -> `Bug Fixes`
- `perf` -> `Performance Improvements`
- `revert` -> `Reverts`
- `docs` -> `Documentation`
- `style` -> `Styles`
- `refactor` -> `Code Refactoring`
- `test` -> `Tests`
- `build` -> `Build System`
- `ci` -> `Continous Integatrion`
- `chore` -> `Chores`

## Development

Run all tests:

```bash
$ npm test
```

## Maintainers

[@olliejennings](https://github.com/olliejennings)
