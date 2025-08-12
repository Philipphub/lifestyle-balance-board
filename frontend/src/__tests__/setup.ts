// Extend Jest-style assertions for DOM nodes (e.g., toBeInTheDocument, toHaveTextContent)
import "@testing-library/jest-dom";

// Vitest lifecycle and mocking utilities
import { beforeEach, afterEach, vi } from "vitest";

// Cleanup helper to unmount components and reset the DOM between tests
import { cleanup } from "@testing-library/react";

// Before each test, ensure process.env includes a stable default for the
// backend base URL used by the ApiService. This keeps tests deterministic
// regardless of the developer's local environment variables.
beforeEach(() => {
    Object.defineProperty(process, "env", {
        value: {
            ...process.env,
            NEXT_PUBLIC_API_BASE_URL: "http://localhost:3001"
        }
    });
});

// After each test:
// - cleanup the DOM (unmount components, remove listeners)
// - clear mocks to avoid cross-test leakage
afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});
