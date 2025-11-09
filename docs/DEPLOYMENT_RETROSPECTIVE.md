# Deployment Retrospective: Railway Deployment Journey

**Date:** November 9, 2025  
**Project:** Petra Platform - NestJS API Deployment to Railway  
**Final Outcome:** ✅ Successful deployment using Railway's Railpack

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Initial Approach: Docker](#initial-approach-docker)
3. [Problems Encountered](#problems-encountered)
4. [The Switch to Railpack](#the-switch-to-railpack)
5. [Final Working Solution](#final-working-solution)
6. [Key Learnings](#key-learnings)
7. [Best Practices](#best-practices)

---

## Executive Summary

### What Worked ✅

- **Platform:** Railway (https://railway.app)
- **Builder:** Railpack (Railway's native builder, formerly Nixpacks)
- **Package Manager:** pnpm 10.20.0 with workspace support
- **Build Approach:** Sequential building of workspace packages
- **TypeScript Strategy:** Path mapping to source files for cross-package compilation

### What Didn't Work ❌

- Docker multi-stage builds in a monorepo
- Various TypeScript compilation strategies (project references, dist-based imports)
- Multiple attempts at fixing build context and `.dockerignore` issues

### Time Investment

- **Docker attempts:** ~2-3 hours
- **Railpack migration:** ~30 minutes
- **Final fix:** ~15 minutes

**Lesson:** Sometimes the simplest solution is to use the platform's native tooling.

---

## Initial Approach: Docker

### Why Docker Was Chosen

1. **Perceived Control:** Docker provides full control over the build environment
2. **Reproducibility:** "Works on my machine" → "Works everywhere"
3. **Industry Standard:** Docker is widely adopted and well-documented
4. **Multi-stage Builds:** Efficient for production images

### Docker Strategy

We attempted a multi-stage Dockerfile (`Dockerfile.api`) with the following stages:

1. **Base stage:** Install pnpm and set up the build environment
2. **Dependencies stage:** Copy package files and install dependencies
3. **Build stage:** Build shared packages (`@petra/types`, `@petra/utils`) and the API
4. **Production stage:** Copy built artifacts and run the application

**Initial Dockerfile location:** `apps/api/Dockerfile`  
**Final Dockerfile location:** Root `Dockerfile.api` (consolidated approach)

---

## Problems Encountered

### 1. Build Context Issues 🔴

**Problem:**  
Railway was using `apps/api/` as the build context, but `pnpm-lock.yaml` was at the repository root.

```
ERR_PNPM_NO_LOCKFILE Cannot install with "frozen-lockfile" because pnpm-lock.yaml is absent
```

**Root Cause:**  
Docker's security model prevents accessing files outside the build context. When the Dockerfile is in `apps/api/`, Docker can't see `../../pnpm-lock.yaml`.

**Attempted Solutions:**
- ❌ Created `apps/api/Dockerfile` and tried to use relative paths
- ❌ Created `railway.toml` with invalid `buildContext` property
- ❌ Set Dockerfile path to `/Dockerfile.api` (leading slash interpreted as absolute path)
- ✅ **What we should have done:** Moved Dockerfile to root and removed leading slash

### 2. `.dockerignore` Conflicts 🔴

**Problem:**  
The `.dockerignore` file was not committed to Git (it was ignored by `.gitignore`), causing Railway to apply default ignore rules that excluded `pnpm-lock.yaml`.

**Root Cause:**  
Without an explicit `.dockerignore`, Docker/Railway uses heuristics that often ignore lockfiles and `node_modules/`.

**Attempted Solutions:**
- ❌ Added `!pnpm-lock.yaml` to `.dockerignore` but file wasn't committed
- ❌ Added debug `ls -la` commands to Dockerfile to verify file presence
- ✅ **What we should have done:** Force-add `.dockerignore` to Git and verify it was committed

### 3. pnpm Version Mismatch 🔴

**Problem:**  
Lockfile was generated with pnpm 10.x, but Dockerfile was trying to use pnpm 9.15.0.

```
ERR_PNPM_UNSUPPORTED_LOCKFILE_VERSION 
This lockfile was generated with pnpm 10.x but you're using pnpm 9.x
```

**Root Cause:**  
Local environment upgraded to pnpm 10.x, but Dockerfile wasn't updated.

**Attempted Solutions:**
- ❌ Regenerated lockfile multiple times
- ✅ **What eventually worked:** Updated Dockerfile to use `pnpm@10.20.0` and regenerated lockfile

### 4. Multi-stage Build Copy Issues 🔴

**Problem:**  
The `production` stage was missing `COPY pnpm-lock.yaml ./` command, causing build failures even after fixing earlier issues.

```
ERR_PNPM_NO_LOCKFILE Cannot install with "frozen-lockfile" because pnpm-lock.yaml is absent
```

**Root Cause:**  
Each `FROM` instruction in Docker creates a fresh environment. Files must be re-copied in each stage.

**Attempted Solutions:**
- ❌ Debug commands showed file in `dependencies` stage but not `production`
- ✅ **What eventually worked:** Added `COPY pnpm-lock.yaml ./` to production stage

### 5. TypeScript Module Resolution (The Big One) 🔴🔴🔴

**Problem:**  
`@petra/utils` couldn't find `@petra/types` during the Docker build, despite both being workspace packages.

```
error TS2307: Cannot find module '@petra/types' or its corresponding type declarations.
```

**Root Cause:**  
TypeScript couldn't resolve the workspace package `@petra/types` from `@petra/utils` because:
1. pnpm workspace links were not properly established in Docker layers
2. TypeScript `extends` path to `@petra/config/typescript/base.json` was incorrect in Docker environment
3. Various TypeScript compilation strategies conflicted with monorepo setup

**Attempted Solutions (ALL FAILED):**

#### ❌ Attempt 1: Explicit Dependency
Added `"@petra/types": "workspace:*"` to `packages/utils/package.json`
- **Why it failed:** Dependency was already there; wasn't the issue

#### ❌ Attempt 2: Refresh Workspace Links
Added multiple `pnpm install --frozen-lockfile` commands after each build step
- **Why it failed:** Over-engineering; didn't address root cause

#### ❌ Attempt 3: Path Mapping to Dist
Changed `packages/utils/tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@petra/types": ["../types/dist/index"]
    }
  }
}
```
- **Why it failed:** Dist doesn't exist during build; circular dependency

#### ❌ Attempt 4: TypeScript Project References
Changed to `composite: true` and `references` with `tsc --build`
```json
{
  "compilerOptions": {
    "composite": true,
    "references": [{ "path": "../types" }]
  }
}
```
- **Why it failed:** Conflicted with path mapping; complex setup for monorepos

#### ❌ Attempt 5: Hybrid Approach
Combined project references with source path mapping
- **Why it failed:** `composite: true` conflicts with mapping to source files (TS6305 error)

#### ✅ Attempt 6: Path Mapping to Source (FINALLY WORKED)
```json
{
  "extends": "@petra/config/typescript/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
    "baseUrl": "../..",
    "paths": {
      "@petra/types": ["packages/types/src/index.ts"]
    }
  }
}
```
- **Why it worked:** 
  - Removed `rootDir` restriction
  - Pointed to source files, not dist
  - Used correct baseUrl relative to monorepo root
  - No `composite` or project references complexity

### 6. Config Package Resolution 🔴

**Problem:**  
TypeScript couldn't find `@petra/config/typescript/base.json` during Docker build.

```
error TS6053: File '@petra/config/typescript/base.json' not found.
```

**Root Cause:**  
The `extends` path used package name syntax (`@petra/config/...`) which doesn't work in Docker without proper Node.js module resolution.

**Attempted Solutions:**
- ❌ `extends: "../../config/typescript/base.json"` (wrong relative path)
- ✅ Eventually reverted to `extends: "@petra/config/typescript/base.json"` (worked after fixing workspace links)

---

## The Switch to Railpack

### Why We Switched

After multiple failed Docker attempts, we discovered that Railway has a native builder called **Railpack** (formerly Nixpacks) that:

1. ✅ **Automatically detects** Node.js, pnpm, and monorepo structure
2. ✅ **Handles build context** correctly without manual configuration
3. ✅ **Respects `packageManager`** field in `package.json`
4. ✅ **Simpler configuration** with just build and start commands
5. ✅ **No Dockerfile needed** - less to maintain

### Decision Point

> "It's creating too many problems to deploy. So either you can find a solution online by looking at example projects or propose a different approach."

This was the turning point. Sometimes the best solution is to use platform-native tooling.

### Migration Steps

1. **Reverted to clean state:** `git reset --hard 6a16705478cf836f3aa0f3dbea9d78ee3ea5a6cd`
2. **Deleted Docker artifacts:**
   - `Dockerfile.api`
   - `Dockerfile.web-marketing`
   - `Dockerfile.web-coaching`
   - `.dockerignore`
   - `railway.toml`
   - `docs/RAILWAY_DEPLOYMENT.md`
   - `docs/DEPLOYMENT_CHECKLIST.md`
   - `apps/api/railway.env.template`
3. **Configured Railway with Railpack:**
   - Root Directory: `/`
   - Build Command: `pnpm install --frozen-lockfile && pnpm --filter @petra/types build && pnpm --filter @petra/utils build && pnpm --filter @petra/api prisma:generate && pnpm --filter @petra/api build`
   - Start Command: `pnpm --filter @petra/api start`
   - No Dockerfile specified (uses Railpack auto-detection)

---

## Final Working Solution

### Railway Configuration

**Service Settings:**
- **Builder:** Railpack (auto-detected)
- **Root Directory:** `/`
- **Build Command:**
  ```bash
  pnpm install --frozen-lockfile && \
  pnpm --filter @petra/types build && \
  pnpm --filter @petra/utils build && \
  pnpm --filter @petra/api prisma:generate && \
  pnpm --filter @petra/api build
  ```
- **Start Command:**
  ```bash
  pnpm --filter @petra/api start
  ```

**Environment Variables:**
```env
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require
JWT_SECRET=<generated with openssl rand -base64 32>
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
HCAPTCHA_SECRET_KEY=<from hCaptcha dashboard>
HCAPTCHA_SITE_KEY=<from hCaptcha dashboard>
```

### TypeScript Configuration Fix

**`packages/utils/tsconfig.json`:**
```json
{
  "extends": "@petra/config/typescript/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
    "baseUrl": "../..",
    "paths": {
      "@petra/types": ["packages/types/src/index.ts"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Key points:**
- ✅ No `rootDir` (allows cross-package compilation)
- ✅ `baseUrl: "../.."` (relative to monorepo root)
- ✅ Path mapping to **source files**, not dist
- ✅ No `composite` or `references` (keeps it simple)

### Start Script Configuration

**`apps/api/package.json`:**
```json
{
  "scripts": {
    "start": "pnpm prisma:deploy && node dist/main",
    "prisma:deploy": "prisma migrate deploy"
  }
}
```

**Why this works:**
- Runs migrations before starting the server
- Uses `prisma migrate deploy` (production-safe, no prompts)
- Simple and reliable

---

## Key Learnings

### 1. Platform-Native Tools > Custom Solutions

Railway's Railpack is **specifically designed** for deploying Node.js monorepos. It handles:
- Workspace detection
- Package manager versioning
- Build context automatically

**Lesson:** Don't reinvent the wheel. Use platform-native tools when available.

### 2. Docker in Monorepos is Complex

Docker in monorepos requires careful attention to:
- Build context (must include all packages)
- `.dockerignore` (must be explicit about what to include)
- Multi-stage builds (re-copy files in each stage)
- Workspace symlinks (can break between stages)

**Lesson:** Docker is powerful but adds complexity. Only use it if you need the control.

### 3. TypeScript Path Mapping Best Practices

For monorepo cross-package references:
- ✅ Map to **source files**, not dist
- ✅ Use `baseUrl` relative to monorepo root
- ✅ Avoid `composite: true` unless you need incremental builds
- ✅ Keep it simple - path mapping is enough for most cases

**Lesson:** TypeScript project references are powerful but overkill for simple cross-package imports.

### 4. Lockfile Consistency is Critical

Always ensure:
- Same pnpm version locally and in deployment
- `packageManager` field in root `package.json`
- Lockfile committed to Git
- No manual edits to lockfile

**Lesson:** Package manager version mismatches cause cryptic errors.

### 5. Start Simple, Add Complexity Only When Needed

We started with Docker (complex) when Railpack (simple) would have worked from the start.

**Lesson:** Choose the simplest solution that works. Add complexity incrementally only when necessary.

### 6. Database SSL Configuration

For production Supabase connection:
- ✅ Use **connection pooler** (port 6543) for better performance
- ✅ Add `?sslmode=require` for encrypted connections
- ✅ Don't need `directUrl` in server-based deployments

**Lesson:** Connection pooling improves performance; SSL is mandatory for production.

---

## Best Practices

### For Railway Deployments

1. **Use Railpack for Node.js projects** unless you have specific Docker requirements
2. **Set explicit Build and Start commands** in Railway dashboard
3. **Use environment variable templates** for team onboarding
4. **Test locally first** with the same pnpm version
5. **Monitor build logs** carefully - Railpack provides excellent output

### For Monorepo TypeScript Projects

1. **Keep TypeScript config simple** - avoid project references unless necessary
2. **Use path mapping to source files** for cross-package imports
3. **Build packages in dependency order** explicitly in build command
4. **Avoid `rootDir` in TypeScript config** - it prevents cross-package compilation
5. **Use workspace protocol** (`workspace:*`) for internal dependencies

### For pnpm Workspaces

1. **Specify `packageManager` field** in root `package.json`
2. **Use `--filter` flag** to build/run specific packages
3. **Install from root** (`pnpm install` at root installs all workspaces)
4. **Use `--frozen-lockfile`** in CI/production builds
5. **Keep workspace dependencies updated** with `pnpm up -r`

### For NestJS Production

1. **Run migrations in start script** (`prisma migrate deploy`)
2. **Use health checks** (`/health` endpoint)
3. **Set `NODE_ENV=production`** for optimizations
4. **Generate strong JWT secrets** (`openssl rand -base64 32`)
5. **Configure CORS** properly for your frontend domain

---

## Comparison: Docker vs Railpack

| Aspect | Docker | Railpack |
|--------|--------|----------|
| **Configuration** | Dockerfile (~50 lines) | Build & Start commands |
| **Build Context** | Manual (error-prone) | Automatic |
| **Monorepo Support** | Complex | Native |
| **Build Time** | ~3-4 minutes | ~2-3 minutes |
| **Debugging** | Difficult (opaque layers) | Easy (clear logs) |
| **Flexibility** | High (full control) | Medium (platform constraints) |
| **Maintenance** | High | Low |
| **Learning Curve** | Steep | Gentle |
| **Best For** | Multi-service, custom needs | Standard Node.js apps |

**Verdict:** For a standard NestJS API in a pnpm monorepo on Railway, **Railpack is the better choice**.

---

## Timeline of Attempts

```
[14:00] Initial Docker approach - Dockerfile in apps/api/
        ❌ Build context issue

[14:20] Move Dockerfile to root, create railway.toml
        ❌ Invalid buildContext property

[14:40] Fix railway.toml, update Dockerfile path
        ❌ Leading slash in path (/Dockerfile.api)

[15:00] Fix path, regenerate lockfile with pnpm 10.x
        ❌ pnpm-lock.yaml still not found

[15:20] Debug .dockerignore, force-add to Git
        ❌ Missing COPY in production stage

[15:40] Fix multi-stage COPY commands
        ❌ TypeScript can't find @petra/types

[16:00] Add @petra/types dependency to @petra/utils
        ❌ Still can't resolve

[16:15] Try path mapping to dist
        ❌ Dist doesn't exist during build

[16:30] Try TypeScript project references
        ❌ Conflicts with path mapping

[16:45] Try hybrid approach
        ❌ TS6305 error (composite conflicts)

[17:00] User frustrated: "Too many problems"
        💡 Suggest switching to Railpack

[17:10] Revert commits, delete Docker files
        ✅ Clean slate

[17:15] Configure Railpack, create build command
        ❌ prisma:generate not found

[17:20] Fix build command with --filter flags
        ❌ TypeScript error returns (revert lost fix)

[17:25] Re-apply path mapping fix to tsconfig.json
        ✅ BUILD SUCCESSFUL! 🎉
```

**Total time:** ~3.5 hours  
**Successful solution time:** ~20 minutes (if we had started with Railpack)

---

## Conclusion

The journey from Docker to Railpack taught us valuable lessons about:

1. **Choosing the right tool for the job** - Platform-native solutions often beat custom approaches
2. **Monorepo complexity** - TypeScript, pnpm, and Docker each add layers of complexity
3. **Incremental problem-solving** - Sometimes you need to step back and try a different approach
4. **Documentation importance** - This retrospective will save hours for future deployments

### Final Architecture

```
Petra Platform (Railway)
├── Database: Supabase PostgreSQL (connection pooler + SSL)
├── API: NestJS on Railway (Railpack)
│   ├── Build: Sequential package builds
│   ├── Migrations: Auto-deploy on start
│   └── TypeScript: Path mapping to sources
└── Environment: Production-grade secrets and config
```

### What We'd Do Differently

If starting from scratch:

1. ✅ **Start with Railpack** - skip Docker entirely
2. ✅ **Use path mapping to sources** from day one
3. ✅ **Test build command locally** before deploying
4. ✅ **Document environment variables** early
5. ✅ **Set up health checks** from the start

---

**Document created:** November 9, 2025  
**Build successful:** 11:28 UTC  
**Deploy time:** 139.92 seconds

🚀 **Petra Platform API is now live on Railway!**

