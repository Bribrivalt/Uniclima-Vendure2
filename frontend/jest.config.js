/**
 * Jest Configuration for Uniclima Frontend
 * 
 * This configuration sets up Jest for testing React components
 * in a Next.js environment with TypeScript support.
 */

const nextJest = require('next/jest');

/**
 * Create Jest configuration with Next.js defaults
 */
const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files
    dir: './',
});

/**
 * Custom Jest configuration
 */
const customJestConfig = {
    // Setup files to run after Jest is initialized
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

    // Module name mapping for path aliases
    moduleNameMapper: {
        // Handle path aliases (@ -> src/)
        '^@/(.*)$': '<rootDir>/$1',
        // Handle CSS module imports
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    },

    // Test environment
    testEnvironment: 'jest-environment-jsdom',

    // File patterns for test files
    testMatch: [
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)',
    ],

    // Files to ignore during testing
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/.next/',
    ],

    // Transform files before testing
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    },

    // Collect coverage from these files
    collectCoverageFrom: [
        'components/**/*.{js,jsx,ts,tsx}',
        'lib/**/*.{js,jsx,ts,tsx}',
        'app/**/*.{js,jsx,ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
        '!**/__tests__/**',
    ],

    // Coverage thresholds
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50,
        },
    },

    // Report formats
    coverageReporters: ['text', 'lcov', 'html'],

    // Verbose output
    verbose: true,
};

// Export the configuration
module.exports = createJestConfig(customJestConfig);