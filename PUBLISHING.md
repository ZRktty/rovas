# Steps to Publish Your NPM Package

## Prerequisites

1. **Create an npm account** at https://www.npmjs.com/signup
2. **Install Node.js and npm** (if not already installed)

## Publishing Steps

### Step 1: Prepare Your Package

Make sure you have these essential files:
- ✅ `package.json` - Package configuration
- ✅ `index.js` - Main entry point
- ✅ `README.md` - Documentation
- ✅ `LICENSE` - License file
- ✅ `.gitignore` - Git ignore rules
- ✅ `.npmignore` - NPM ignore rules (optional)

### Step 2: Update package.json

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