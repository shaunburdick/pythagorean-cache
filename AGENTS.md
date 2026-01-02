# Agent Guidelines for pythagorean-cache

This document provides coding standards and conventions for AI agents working in this repository.

## Project Overview

**pythagorean-cache** is a TypeScript library that implements an event-driven cache that dumps its contents when it reaches a size limit or after a time interval. It extends Node.js EventEmitter and emits `dump` events with cached items.

## Build, Lint, and Test Commands

### Standard Commands
```bash
npm test              # Run linting + unit tests
npm run test:unit     # Run Jest tests only (skips linting)
npm run lint          # Run ESLint on all files
npm run lint:fix      # Auto-fix linting issues where possible
npm run build         # Clean and transpile TypeScript to dist/
```

### Running Single Tests
```bash
# Run a specific test file
npm run test:unit -- src/__tests__/index.test.ts

# Run tests matching a pattern
npm run test:unit -- -t "should emit items"

# Run in watch mode during development
npm run test:unit -- --watch
```

### Pre-commit Checklist
Before committing, verify:
- [ ] `npm run lint` passes with zero errors
- [ ] `npm test` passes all tests
- [ ] `npm run build` completes successfully

## Code Style Guidelines

### Import Conventions

**Prefer Node.js protocol imports:**
```typescript
// ✅ GOOD - Use node: protocol
import { EventEmitter } from 'node:events';

// ❌ BAD - Avoid bare module names for built-ins
import { EventEmitter } from 'events';
```

**Import order:**
1. Node.js built-in modules (with `node:` protocol)
2. External dependencies
3. Internal modules (relative imports)

### TypeScript Standards

**Strict Type Safety:**
```typescript
// ✅ GOOD - Explicit null/undefined checks
if (typeof this.opts.size === 'number') { ... }
if (this.opts.interval !== undefined) { ... }

// ❌ BAD - Implicit truthiness with nullable types
if (this.opts.size) { ... }
```

**Nullish Coalescing:**
```typescript
// ✅ GOOD - Use ?? for null/undefined
const count = this.opts.size ?? this.length;

// ❌ BAD - Avoid || with numbers (treats 0 as falsy)
const count = this.opts.size || this.length;
```

**Other TypeScript Rules:**
- Mark class members as `readonly` if they're never reassigned
- Use generics for type flexibility: `PythagoreanCache<T = unknown>`
- Provide sensible defaults for generic parameters

### Formatting and Style

- **Indentation:** 4 spaces (per `.editorconfig`)
- **Line Endings:** LF (Unix-style)
- **Final Newline:** Always include

**Iteration - Use for...of instead of .forEach():**
```typescript
// ✅ GOOD
for (const item of items) { cache.push(item); }

// ❌ BAD (unicorn/no-array-for-each)
items.forEach(item => cache.push(item));
```

**Conditionals - Explicit checks for objects/undefined:**
```typescript
// ✅ GOOD
if (this.interval !== undefined) { clearInterval(this.interval); }

// ❌ BAD - Implicit truthiness
if (this.interval) { clearInterval(this.interval); }
```

### Naming Conventions

- **Classes:** PascalCase (`PythagoreanCache`)
- **Interfaces/Types:** PascalCase with descriptive suffixes (`PythagoreanCacheOpts`)
- **Variables/Methods:** camelCase (`startInterval`, `checkLimit`)
- **Private Members:** camelCase with `private` keyword (no underscore prefix)

### Documentation

**JSDoc comments required for:**
- All public classes and methods
- Complex interfaces
- Non-obvious behavior

**Format:**
```typescript
/**
 * Push an item onto the cache
 *
 * @param items The items to push onto the cache
 * @returns the new size of the cache
 */
public push(...items: T[]): number { ... }
```

Include `@link` tags for external references when relevant.

### Error Handling

- Throw descriptive errors: `throw new Error('You must specify either a size or interval (or both)');`
- Validate inputs early in constructors/methods
- Use proper TypeScript error types - avoid `any` for caught errors

## Testing Standards

**Framework:** Jest with ts-jest preset (coverage enabled by default)

**Test Structure:**
- Use `describe()` blocks for grouping related tests
- Use clear, descriptive test names: `'should emit items when size is reached'`
- Always call `done()` for async tests with callbacks

**Example Pattern:**
```typescript
it('should emit items when size is reached', (done) => {
    const cache = new PythagoreanCache<number>({ size: 10 });
    
    cache.once('dump', (items) => {
        expect(items).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        done();
    });
    
    for (const i of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        cache.push(i);
    }
});
```

## ESLint Configuration

Uses `eslint-config-shaunburdick` v5.0.0 with strict TypeScript and Unicorn rules.

**Key Rules Enforced:**
- `unicorn/prefer-node-protocol` - Use `node:` prefix for built-ins
- `unicorn/no-array-for-each` - Prefer `for...of` over `.forEach()`
- `@typescript-eslint/strict-boolean-expressions` - Explicit null checks required
- `@typescript-eslint/prefer-nullish-coalescing` - Use `??` over `||`
- `@typescript-eslint/prefer-readonly` - Mark non-reassigned members readonly
- `@typescript-eslint/no-unnecessary-condition` - Remove always-true conditions

**Never disable linting rules** - refactor code to comply instead.

## GitHub Actions CI/CD

**Test Workflow** (`.github/workflows/test.yml`):
- Runs on: `push` and `pull_request` to `main` branch
- Tests on Node.js **20.x** and **22.x** (last two LTS versions only)
- Executes: `npm ci && npm test`

**Publish Workflow** (`.github/workflows/publish.yml`):
- Runs on: `push` to `main` branch
- Uses Node.js **22.x** (current active LTS)
- Tests, builds, and publishes to npm registry
- Requires `NPM_TOKEN` secret

When updating Node.js versions in CI, maintain only the last two LTS versions for testing.

## Common Patterns in This Codebase

- **Event-driven architecture** using Node.js EventEmitter
- **Generic classes** for type-safe collections
- **Optional parameters** with interface-based options
- **Timer management** with proper cleanup (clearInterval)
- **Defensive programming** with early validation

## Technology Stack

- **TypeScript:** v5.9.3 (target: ES2015, module: CommonJS)
- **ESLint:** v9.39.2 with eslint-config-shaunburdick v5.0.0
- **Jest:** v30.2.0 with ts-jest v29.4.6
- **Node.js:** Testing on v20.x and v22.x LTS versions
- **Build Output:** Source maps (inline), type declarations included
- **Runtime Dependencies:** None (uses Node.js built-in EventEmitter)
