# Publishing rovas

## Normal flow — automated via CI

Publishing is handled automatically. When a PR is merged to `main`, the GitHub
Actions `release` job runs semantic-release, which:

1. Analyses commit messages since the last release.
2. Bumps the version in `package.json` and updates `CHANGELOG.md`.
3. Creates a git tag and a GitHub Release.
4. Publishes the package to npm via **Trusted Publishing** (OIDC — no stored token needed).

Commit message conventions that trigger a release:

| Prefix | Release type |
| --- | --- |
| `fix:` / `fix(scope):` | patch (`0.0.x`) |
| `feat:` / `feat(scope):` | minor (`0.x.0`) |
| `BREAKING CHANGE:` footer | major (`x.0.0`) |

## Manual publishing (emergency only)

The CI workflow is the authorised release path. Only publish manually if CI is broken.

```bash
# 1. Install dependencies
pnpm install

# 2. Run the full test suite
pnpm test

# 3. Build the dist/ artefacts (ESM + CJS + TypeScript declarations)
pnpm build

# 4. Dry-run to confirm what will be included
npm publish --dry-run

# 5. Publish (requires npm authentication with write access to rovas)
pnpm publish
```

### What gets published

The `"files"` field in `package.json` limits the tarball to `dist/`:

| Path | Description |
| --- | --- |
| `dist/index.js` | ESM build |
| `dist/index.cjs` | CommonJS build |
| `dist/index.d.ts` | TypeScript declarations (ESM) |
| `dist/index.d.cts` | TypeScript declarations (CJS) |

## Resources

- [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers)
- [semantic-release](https://semantic-release.gitbook.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)


Update the following fields in `package.json`:

```json
{
  "name": "your-unique-package-name",  // Must be unique on npm!
  "version": "1.0.0",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "url": "https://github.com/yourusername/your-repo.git"
  }
}
```

**Important:** Check if the package name is available:
```bash
npm search your-package-name
```

### Step 3: Test Your Package Locally

```bash
# Run your tests
npm test

# Test the package locally by linking it
npm link

# Then in another project, you can use:
npm link your-package-name
```

### Step 4: Login to npm

Open your terminal and login:

```bash
npm login
```

You'll be prompted for:
- Username
- Password
- Email
- One-time password (if you have 2FA enabled)

### Step 5: Publish Your Package

```bash
# Dry run to see what will be published
npm publish --dry-run

# Actually publish
npm publish
```

**For scoped packages (e.g., @username/package):**
```bash
npm publish --access public
```

### Step 6: Verify Publication

1. Visit https://www.npmjs.com/package/your-package-name
2. Test installation:
```bash
npm install your-package-name
```

## Updating Your Package

### Step 1: Make Changes

Update your code as needed.

### Step 2: Update Version

Use semantic versioning (Major.Minor.Patch):

```bash
# Patch release (1.0.0 -> 1.0.1) - bug fixes
npm version patch

# Minor release (1.0.0 -> 1.1.0) - new features
npm version minor

# Major release (1.0.0 -> 2.0.0) - breaking changes
npm version major
```

### Step 3: Publish Update

```bash
npm publish
```

## Best Practices

1. **Use Semantic Versioning**
   - MAJOR version for breaking changes
   - MINOR version for new features
   - PATCH version for bug fixes

2. **Write Good Documentation**
   - Clear README with examples
   - API documentation
   - Installation instructions

3. **Test Before Publishing**
   - Always test your package
   - Use `npm publish --dry-run` first

4. **Add a .npmignore file**
   - Exclude unnecessary files from publication
   - Reduces package size

5. **Consider TypeScript Support**
   - Add type definitions
   - Include .d.ts files

6. **Add Keywords**
   - Help users find your package
   - Add relevant keywords in package.json

7. **Keep README Updated**
   - Update documentation with changes
   - Include examples and use cases

## Unpublishing (Use with Caution!)

You can only unpublish within 72 hours of publishing:

```bash
npm unpublish your-package-name@version
```

**Warning:** Unpublishing is discouraged, especially if others depend on your package. Consider deprecating instead:

```bash
npm deprecate your-package-name@version "reason for deprecation"
```

## Additional Resources

- npm Documentation: https://docs.npmjs.com/
- Semantic Versioning: https://semver.org/
- npm Best Practices: https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry