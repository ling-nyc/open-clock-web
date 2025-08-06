import '@testing-library/jest-dom';

// Mock document.fonts API for testing environment
Object.defineProperty(document, 'fonts', {
    value: {
        check: jest.fn(() => true),
        load: jest.fn(() => Promise.resolve()),
        ready: Promise.resolve(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
    },
    writable: true,
});
