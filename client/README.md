# Client Test Suite

## Running Tests

```bash
# Run all tests
npm test

# Run tests once (CI mode)
npm run test:run

# Run with coverage
npm run test:coverage
```

## Regression Testing

This project includes automated regression detection to help identify when tests start failing.

### How It Works

1. **Baseline Creation**: Test results are stored in `test-results-baseline.json`
2. **Regression Detection**: Each test run compares against the baseline to identify:
   - **Regressions**: Tests that passed before but now fail
   - **New Failures**: New tests that fail
   - **Fixed Tests**: Tests that were failing but now pass

### Usage

```bash
# Check for regressions (run tests and compare)
npm run test:regression

# Update baseline after confirming tests are stable
npm run test:update-baseline
```

### Regression Script Output

The regression checker provides clear reporting:

```
🔍 Regression Analysis Complete

🚨 2 TEST REGRESSIONS DETECTED:
  ❌ ComponentA::should render correctly
  ❌ ComponentB::should handle errors

📊 SUMMARY:
   Total Tests: 50
   Passing: 46
   Failing: 6
   Regressions: 2
   New Failures: 1
   Fixed: 1

❌ REGRESSIONS DETECTED - FIX REQUIRED
```

### Workflow

1. **After fixing test issues**: Run `npm run test:update-baseline` to update the baseline
2. **During development**: Run `npm run test:regression` to catch regressions early
3. **In CI/CD**: Use `npm run test:regression` to fail builds with new test failures

### Files

- `test-results.json`: Current test run results (gitignored)
- `test-results-baseline.json`: Baseline for regression comparison (tracked)
- `scripts/check-regressions.js`: Regression analysis script
- `vitest.config.js`: Configured for JSON output

### Configuration

The regression system is configured in:
- `vitest.config.js`: JSON reporter output
- `package.json`: Regression-related scripts
- `.gitignore`: Excludes current results, includes baseline
