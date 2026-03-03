# Troubleshooting npm Install Issues

If `npm install` fails with exit code 1, follow these solutions in order:

## Solution 1: Clean Install (Recommended)

### Windows
```bash
cd c:\app
rmdir /s /q node_modules
del package-lock.json
npm install
```

### macOS/Linux
```bash
cd /path/to/app
rm -rf node_modules package-lock.json
npm install
```

Or use the provided script:
```bash
# Windows
install.bat

# macOS/Linux
bash install.sh
```

## Solution 2: Check Node.js Version

```bash
node --version       # Should be 18.0.0 or higher
npm --version        # Should be 9.0.0 or higher
```

If version is too old, download from https://nodejs.org

## Solution 3: Clear npm Cache

```bash
npm cache clean --force
npm install
```

## Solution 4: Check System Disk Space

Ensure you have at least 2GB free disk space. Run:

```bash
# Windows
dir C:

# macOS/Linux
df -h
```

## Solution 5: Install with No Optional Dependencies

```bash
npm install --no-optional
```

## Solution 6: Use npm audit to Check for Issues

```bash
npm audit fix --force
npm install
```

## Solution 7: Upgrade npm

```bash
npm install -g npm@latest
npm install
```

## Solution 8: Check for Network Issues

If you're behind a corporate proxy or firewall:

```bash
# Set npm registry explicitly
npm config set registry https://registry.npmjs.org
npm install
```

## Solution 9: Completely Reset npm

```bash
# Windows
npm config reset
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json
npm install

# macOS/Linux
npm config reset
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## If npm install Still Fails

Check the detailed error message. Look for:

- **ERESOLVE**: Version conflict in dependencies
  → Use: `npm install --legacy-peer-deps`

- **ERR! code ETIMEDOUT**: Network timeout
  → Increase timeout: `npm install --fetch-timeout=120000`

- **ERR! code EACCES**: Permission denied
  → On macOS/Linux: Try `sudo npm install`

- **ERR! code ERR_INVALID_PACKAGE_DIST**: Corrupted download
  → Use Solution 1 (Clean Install)

## Final Fallback: Complete System Reset

```bash
# Windows (Admin PowerShell)
rmdir -Recurse -Force node_modules
del package-lock.json
rmdir -Recurse -Force $env:APPDATA\npm-cache
npm cache clean --force
npm install

# macOS/Linux
rm -rf node_modules package-lock.json ~/.npm
npm cache clean --force
npm install
```

## Verify Installation

After install completes, verify with:

```bash
npm list --depth=0
npm run type-check
npm run lint
```

If all three commands succeed without errors, installation is complete! ✅

## Next Steps After Successful Install

1. Copy env template:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your credentials

3. Deploy Convex:
   ```bash
   npx convex deploy
   ```

4. Run the app:
   ```bash
   npm run dev
   ```

---

**Still having issues?** Check the error log in detail:
- Look for the package name that failed
- Search "npm [package-name] version conflict" on Stack Overflow
- Check if there's a newer version of the package available
