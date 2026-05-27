# rovas — MVP TODO (v0.2.0)

Paste this into Claude Code. Work top-to-bottom. Each task is self-contained.

---

## 1. Fix failing tests

Five tests currently fail. Fix the source, not the tests — the tests are correct.

### 1a. `cs` codepoint collision with `b`

In `src/alphabet.ts`, `cs` and `b` were both mapped to `U+10CC2` (EB).
The fix (`cs` → `U+10CC6` ECS) is already applied but verify the reverse map
in `src/reverse.ts` correctly resolves `U+10CC6` → `'cs'` and `U+10CC2` → `'b'`.

Run: `pnpm test -- --reporter=verbose test/reverse.test.ts`

### 1b. `dz` / `dzs` reverse map broken

`dz` is composed of D (`U+10CC7`) + Z (`U+10CEF`).
`dzs` is composed of D (`U+10CC7`) + ZS (`U+10CF0`).

In `src/reverse.ts`, the constants `DZ_ROVAS` and `DZS_ROVAS` use wrong codepoints.
Fix them to match the exact codepoints used in `src/alphabet.ts` CONSONANTS map.

### 1c. Wrong test expectation: `egészség` does not contain `gy`

In `test/transliterate.test.ts`, the test asserting `"egészség"` contains `gy` is wrong —
the word is `e-g-é-sz-s-é-g`, no `gy`. Fix the test to assert `sz` only, or replace
the example word with one that actually contains `gy` (e.g. `"egység"` = unity).

---

## 2. Add `toRovas` / `toLatin` short aliases

In `src/index.ts`, add:

```ts
export const toRovas = (input: string, options?: TransliterateOptions) =>
  transliterate(input, options).rovas

export const toLatin = reverse
```

These are the ergonomic one-liner API that most users will reach for.
Keep `transliterate` and `reverse` exported too — they return richer types.

---

## 3. LICENSE

Create `LICENSE` file in repo root. Use MIT. Year: 2025. Name: Zoltán Rakottyai.

---

## 4. DX tooling

### 4a. Prettier

```bash
pnpm add -D prettier
```

Create `.prettierrc`:
```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "trailingComma": "all"
}
```

Create `.prettierignore`: `dist/`, `node_modules/`, `coverage/`

Add to `package.json` scripts:
```json
"format": "prettier --write .",
"format:check": "prettier --check ."
```

### 4b. ESLint

```bash
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Create `eslint.config.mjs` (flat config):
```js
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'

export default [
  { ignores: ['dist/', 'node_modules/', 'coverage/'] },
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    languageOptions: { parser: tsparser },
    plugins: { '@typescript-eslint': tseslint },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
]
```

Add to `package.json` scripts:
```json
"lint": "eslint ."
```

### 4c. Husky + lint-staged

```bash
pnpm add -D husky lint-staged
pnpm exec husky init
```

`.husky/pre-commit`:
```sh
pnpm exec lint-staged
```

Add to `package.json`:
```json
"lint-staged": {
  "*.ts": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

---

## 5. Vitest coverage

In `vitest.config.ts`, enforce thresholds:

```ts
coverage: {
  provider: 'v8',
  reporter: ['text', 'lcov', 'html'],
  include: ['src/**/*.ts'],
  thresholds: {
    lines: 90,
    functions: 90,
    branches: 85,
  },
},
```

Add to `package.json` scripts:
```json
"test:coverage": "vitest run --coverage"
```

Run `pnpm test:coverage` and fix anything below threshold.

---

## 6. semantic-release

```bash
pnpm add -D semantic-release @semantic-release/changelog @semantic-release/git @semantic-release/github
```

Create `release.config.mjs`:
```js
export default {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
    '@semantic-release/npm',
    ['@semantic-release/git', { assets: ['CHANGELOG.md', 'package.json'] }],
    '@semantic-release/github',
  ],
}
```

Commit message convention: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`
Breaking change: add `BREAKING CHANGE:` in commit body → triggers major bump.

---

## 7. GitHub Actions CI

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test:coverage
      - run: pnpm build
```

---

## 8. CONTRIBUTING.md

Create `CONTRIBUTING.md` with:
- Clone + `pnpm install` setup instructions
- How to run tests (`pnpm test`, `pnpm test:watch`)
- Commit message convention (conventional commits)
- How to add a new phoneme mapping (point to `src/alphabet.ts`)
- Note on Unicode references (link to unicode.org PDF chart)
- PR checklist: tests pass, coverage maintained, types correct

---

## 9. CODE_OF_CONDUCT.md

Use the standard Contributor Covenant v2.1.
Download from: https://www.contributor-covenant.org/version/2/1/code_of_conduct/

---

## 10. Update README.md

Add badges at the top (after the title):
```md
[![npm](https://img.shields.io/npm/v/rovas)](https://www.npmjs.com/package/rovas)
[![CI](https://github.com/zrakottyai/rovas/actions/workflows/ci.yml/badge.svg)](...)
[![coverage](https://img.shields.io/codecov/c/github/zrakottyai/rovas)](...)
[![license](https://img.shields.io/npm/l/rovas)](./LICENSE)
```

Add `toRovas` / `toLatin` to the usage examples (they're the new primary API).

---

## 11. Demo React app (optional, v0.2.0 stretch)

Inside `/demo` (separate Vite + React app, not part of the npm package):

```bash
cd demo && pnpm create vite . --template react-ts
```

Features:
- Text input → live rovás output
- Token breakdown table (latin | rovas | codepoint)
- Toggle: vowel omission, classical long vowels
- Copy to clipboard button
- RTL rendering with CSS `direction: rtl`
- Deploy to GitHub Pages via `.github/workflows/demo.yml`

---

## Done checklist

- [ ] All 86 tests pass
- [ ] `toRovas` / `toLatin` exported
- [ ] LICENSE present
- [ ] Prettier configured + formatted
- [ ] ESLint passing
- [ ] Husky pre-commit hook works
- [ ] Coverage ≥ 90% lines
- [ ] semantic-release configured
- [ ] CI workflow passing on GitHub
- [ ] CONTRIBUTING.md written
- [ ] CODE_OF_CONDUCT.md added
- [ ] README badges updated
