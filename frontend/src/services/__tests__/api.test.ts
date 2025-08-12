// Import core testing utilities from Vitest
// - describe: groups related tests
// - it: defines a single test case
// - expect: assertion library to verify outcomes
// - vi: Vitest's mocking/timers/spies utility
// - beforeEach: hook that runs before each test within the current scope
import { describe, it, expect, vi, beforeEach } from "vitest";

// Import the service under test. We will verify how its functions behave
// when the network (fetch) succeeds or fails.
import { ApiService } from "../api";

// Replace the global fetch implementation with a Vitest mock function.
// This lets us precisely control what network calls return (success, HTTP error,
// or network failure) without actually making real HTTP requests.
global.fetch = vi.fn();

// Top-level test suite for all ApiService behavior
describe("ApiService", () => {
    beforeEach(() => {
        // Ensure no mock call history or configurations leak between tests.
        // This keeps each test isolated and deterministic.
        vi.clearAllMocks();
    });

    describe("getApiInfo", () => {
        it("should return API info when successful", async () => {
            // Arrange: Define the exact JSON payload we want our mocked fetch
            // to return when the call succeeds.
            const mockResponse = {
                message: "Lifestyle Balance Board API",
                version: "1.0.0",
                timestamp: "2025-08-12T20:00:00.000Z"
            };

            // Configure the next invocation of the mocked global fetch to resolve
            // with a Response-like object whose `ok` is true and whose `json()`
            // method returns our mock payload. Casting to Response satisfies TS.
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                // Mimic the browser Response.json() method which returns a Promise
                // that resolves to the parsed body.
                json: () => Promise.resolve(mockResponse)
            } as Response);

            // Act: Execute the function under test
            const result = await ApiService.getApiInfo();

            // Assert: Verify the function called fetch with the expected base URL.
            // The base URL is taken from NEXT_PUBLIC_API_BASE_URL in test setup, which
            // defaults to 'http://localhost:3001'.
            expect(fetch).toHaveBeenCalledWith("http://localhost:3001");
            // Assert: Verify the function returned the exact JSON object provided by
            // the mocked response.
            expect(result).toEqual(mockResponse);
        });

        it("should throw error when API request fails", async () => {
            // Arrange: Simulate an HTTP error response by resolving fetch with ok=false
            // and a specific HTTP status code. The implementation throws an Error when
            // response.ok is false.
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: false,
                status: 500
            } as Response);

            // Assert: The promise returned by getApiInfo should reject with the same
            // error message constructed from the status code.
            await expect(ApiService.getApiInfo()).rejects.toThrow(
                "HTTP error! status: 500"
            );
        });

        it("should throw error when network request fails", async () => {
            // Arrange: Simulate a low-level network failure (e.g., DNS, connection).
            // Here, fetch itself rejects instead of resolving to a Response.
            vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

            // Assert: The rejection propagates and should match the thrown error.
            await expect(ApiService.getApiInfo()).rejects.toThrow(
                "Network error"
            );
        });
    });

    describe("getHealthCheck", () => {
        it("should return health check data when successful", async () => {
            // Arrange: Define a mock health check payload to be returned on success.
            const mockHealthResponse = {
                status: "healthy",
                timestamp: "2025-08-12T20:00:00.000Z",
                uptime: 3600
            };

            // Arrange: Configure fetch to resolve successfully with the mock payload.
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockHealthResponse)
            } as Response);

            // Act: Call the function under test
            const result = await ApiService.getHealthCheck();

            // Assert: getHealthCheck should call the '/api/health' route derived from
            // the base URL.
            expect(fetch).toHaveBeenCalledWith(
                "http://localhost:3001/api/health"
            );
            // Assert: The returned value should match the mocked JSON.
            expect(result).toEqual(mockHealthResponse);
        });

        it("should throw error when health check fails", async () => {
            // Arrange: Simulate an HTTP error from the health endpoint.
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: false,
                status: 503
            } as Response);

            // Assert: Expect rejection with the correct message for status 503.
            await expect(ApiService.getHealthCheck()).rejects.toThrow(
                "HTTP error! status: 503"
            );
        });
    });

    describe("testConnection", () => {
        it("should return combined API info and health data when both succeed", async () => {
            // Arrange: Define both mock payloads returned by the two underlying
            // requests (getApiInfo and getHealthCheck) used in Promise.all.
            const mockApiResponse = {
                message: "Lifestyle Balance Board API",
                version: "1.0.0",
                timestamp: "2025-08-12T20:00:00.000Z"
            };

            const mockHealthResponse = {
                status: "healthy",
                timestamp: "2025-08-12T20:00:00.000Z",
                uptime: 3600
            };

            // Arrange: The first mocked fetch call resolves to the API info
            // response, and the second resolves to the health check response.
            vi.mocked(fetch)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockApiResponse)
                } as Response)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockHealthResponse)
                } as Response);

            // Act: Execute the composite function which runs both requests in parallel.
            const result = await ApiService.testConnection();

            // Assert: The combined result should contain both successful payloads.
            expect(result).toEqual({
                apiInfo: mockApiResponse,
                healthCheck: mockHealthResponse
            });
        });

        it("should throw error when API info fails", async () => {
            // Arrange: Make the first underlying call (API info) fail with an HTTP
            // error. Because Promise.all short-circuits on the first rejection, the
            // composite call should reject with this error.
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: false,
                status: 500
            } as Response);

            // Assert: Expect the higher-level function to reject with the same
            // message produced by the failed underlying call.
            await expect(ApiService.testConnection()).rejects.toThrow(
                "HTTP error! status: 500"
            );
        });
    });

    describe("getBaseUrl", () => {
        it("should return environment URL when available", () => {
            // Arrange: Override the env var to simulate a production environment.
            process.env.NEXT_PUBLIC_API_BASE_URL = "https://production-api.com";

            // Assert: The service should prioritize the env var over the localhost default.
            expect(ApiService.getBaseUrl()).toBe("https://production-api.com");
        });

        it("should return localhost URL when environment URL is not available", () => {
            // Arrange: Remove the env var to force the default fallback behavior.
            delete process.env.NEXT_PUBLIC_API_BASE_URL;

            // Assert: When the env var is absent, the default base URL is used.
            expect(ApiService.getBaseUrl()).toBe("http://localhost:3001");
        });
    });
});
