/**
 * Jest Setup File
 * 
 * This file runs before each test file and sets up:
 * - @testing-library/jest-dom matchers
 * - Global mocks for browser APIs
 * - Custom test utilities
 */

// Import Jest DOM matchers for better assertions
import '@testing-library/jest-dom';

/**
 * Mock Next.js Router
 * Provides a mock implementation of useRouter and router context
 */
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => '/',
}));

/**
 * Mock Next.js Image component
 * Replaces the optimized Image with a standard img tag for testing
 */
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props) => {
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        return <img {...props} />;
    },
}));

/**
 * Mock Next.js Link component
 * Replaces Link with a standard anchor tag for testing
 */
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href, ...props }) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

/**
 * Mock window.matchMedia
 * Required for responsive components that use media queries
 */
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

/**
 * Mock IntersectionObserver
 * Required for components that use lazy loading or infinite scroll
 */
class MockIntersectionObserver {
    constructor(callback) {
        this.callback = callback;
    }
    observe() {
        return null;
    }
    unobserve() {
        return null;
    }
    disconnect() {
        return null;
    }
}

window.IntersectionObserver = MockIntersectionObserver;

/**
 * Mock ResizeObserver
 * Required for components that respond to element size changes
 */
class MockResizeObserver {
    observe() {
        return null;
    }
    unobserve() {
        return null;
    }
    disconnect() {
        return null;
    }
}

window.ResizeObserver = MockResizeObserver;

/**
 * Mock scrollTo
 * Prevents errors when components scroll the window
 */
window.scrollTo = jest.fn();

/**
 * Suppress console errors during tests (optional)
 * Uncomment to hide expected console errors in test output
 */
// const originalError = console.error;
// beforeAll(() => {
//     console.error = (...args) => {
//         if (
//             typeof args[0] === 'string' &&
//             args[0].includes('Warning: ReactDOM.render')
//         ) {
//             return;
//         }
//         originalError.call(console, ...args);
//     };
// });
// afterAll(() => {
//     console.error = originalError;
// });