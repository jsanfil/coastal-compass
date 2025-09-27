#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function checkRegressions() {
    const resultsPath = path.join(__dirname, '..', 'test-results.json');
    const baselinePath = path.join(__dirname, '..', 'test-results-baseline.json');

    // Check if current results exist
    if (!fs.existsSync(resultsPath)) {
        console.error('❌ No test results found. Run tests first with: npm test');
        process.exit(1);
    }

    // Check if baseline exists
    if (!fs.existsSync(baselinePath)) {
        console.log('⚠️  No baseline found. Creating initial baseline...');
        fs.copyFileSync(resultsPath, baselinePath);
        console.log('✅ Baseline created. Run tests again to check for regressions.');
        return;
    }

    try {
        const current = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
        const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));

        // Create maps for easy lookup
        const baselineTests = new Map();
        const currentTests = new Map();

        // Vitest JSON format: testResults is an array of suite objects
        baseline.testResults?.forEach(suite => {
            suite.assertionResults?.forEach(test => {
                const testKey = `${suite.name}::${test.title}`;
                baselineTests.set(testKey, test);
            });
        });

        current.testResults?.forEach(suite => {
            suite.assertionResults?.forEach(test => {
                const testKey = `${suite.name}::${test.title}`;
                currentTests.set(testKey, test);
            });
        });

        // Find regressions (tests that passed in baseline but fail now)
        const regressions = [];
        const newFailures = [];
        const fixedTests = [];
        const stillFailing = [];

        currentTests.forEach((test, testKey) => {
            const baselineTest = baselineTests.get(testKey);

            if (!baselineTest) {
                // New test
                if (test.status === 'failed') {
                    newFailures.push(testKey);
                }
            } else {
                // Existing test
                if (baselineTest.status === 'passed' && test.status === 'failed') {
                    regressions.push(testKey);
                } else if (baselineTest.status === 'failed' && test.status === 'passed') {
                    fixedTests.push(testKey);
                } else if (baselineTest.status === 'failed' && test.status === 'failed') {
                    stillFailing.push(testKey);
                }
            }
        });

        // Report results
        console.log('🔍 Regression Analysis Complete\n');

        if (regressions.length > 0) {
            console.log(`🚨 ${regressions.length} TEST REGRESSIONS DETECTED:`);
            regressions.forEach(test => console.log(`  ❌ ${test}`));
            console.log('');
        }

        if (newFailures.length > 0) {
            console.log(`🆕 ${newFailures.length} NEW FAILING TESTS:`);
            newFailures.forEach(test => console.log(`  ❌ ${test}`));
            console.log('');
        }

        if (fixedTests.length > 0) {
            console.log(`✅ ${fixedTests.length} TESTS FIXED:`);
            fixedTests.forEach(test => console.log(`  ✅ ${test}`));
            console.log('');
        }

        if (stillFailing.length > 0) {
            console.log(`📋 ${stillFailing.length} TESTS STILL FAILING (not regressions):`);
            stillFailing.forEach(test => console.log(`  ⚠️  ${test}`));
            console.log('');
        }

        // Summary
        const totalTests = currentTests.size;
        const passingTests = Array.from(currentTests.values()).filter(t => t.status === 'passed').length;
        const failingTests = totalTests - passingTests;

        console.log(`📊 SUMMARY:`);
        console.log(`   Total Tests: ${totalTests}`);
        console.log(`   Passing: ${passingTests}`);
        console.log(`   Failing: ${failingTests}`);
        console.log(`   Regressions: ${regressions.length}`);
        console.log(`   New Failures: ${newFailures.length}`);
        console.log(`   Fixed: ${fixedTests.length}`);

        // Exit with error if there are regressions
        if (regressions.length > 0 || newFailures.length > 0) {
            console.log('\n❌ REGRESSIONS DETECTED - FIX REQUIRED');
            process.exit(1);
        } else {
            console.log('\n✅ NO REGRESSIONS DETECTED');
        }

    } catch (error) {
        console.error('❌ Error analyzing test results:', error.message);
        process.exit(1);
    }
}

checkRegressions();
