// Test utilities
// - describe/it: structure and define test suites and cases
// - expect: assertion library to verify outcomes
// - vi: Vitest's mocking/spying utilities
// - beforeEach: lifecycle hook to reset state before each test
import { describe, it, expect, vi, beforeEach } from "vitest";

// React Testing Library helpers:
// - render: mount a component into a virtual DOM for testing
// - screen: query APIs for finding elements rendered on the screen
// - fireEvent: simulate user interactions (click, input, etc.)
// - waitFor: wait until a condition is met (useful for async UI updates)
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Component under test
import { ApiTestComponent } from "../ApiTestComponent";

// Service dependency that the component uses; we will mock its methods to
// control different success/error scenarios deterministically.
import { ApiService } from "@/services/api";

// Mock the API service so component tests do not make real network calls.
// We provide stub implementations for the methods used by the component.
vi.mock("@/services/api", () => ({
    ApiService: {
        testConnection: vi.fn(),
        getBaseUrl: vi.fn(() => "http://localhost:3001")
    }
}));

// Top-level test suite for the ApiTestComponent UI behavior
describe("ApiTestComponent", () => {
    beforeEach(() => {
        // Ensure mocks are reset before each test to avoid cross-test interference.
        vi.clearAllMocks();
    });

    it("renders with initial state", () => {
        // Arrange + Act: Render the component with default props
        render(<ApiTestComponent />);

        // Assert: Initial UI shows heading and button, but no success or error yet
        expect(
            screen.getByRole("heading", { name: "Backend API Test" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Test Backend Connection" })
        ).toBeInTheDocument();
        expect(screen.queryByTestId("success-message")).not.toBeInTheDocument();
        expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
    });

    it("applies custom className when provided", () => {
        // Act: Render with an extra className
        render(<ApiTestComponent className="custom-class" />);

        // Assert: The wrapper element should include the custom class
        const component = screen.getByTestId("api-test-component");
        expect(component).toHaveClass("custom-class");
    });

    it("shows loading state when testing connection", async () => {
        // Arrange: Make the service call take some time so we can observe loading UI
        vi.mocked(ApiService.testConnection).mockImplementation(
            () => new Promise((resolve) => setTimeout(resolve, 100))
        );

        // Act: Render and click the button to start the test
        render(<ApiTestComponent />);

        const button = screen.getByRole("button");
        fireEvent.click(button);

        // Assert: Button shows loading label and is disabled during the async call
        expect(button).toHaveTextContent("Testing Connection...");
        expect(button).toBeDisabled();
    });

    it("displays success message when connection test succeeds", async () => {
        // Arrange: Simulate a successful testConnection result with API info
        // and health check details.
        const mockResult = {
            apiInfo: {
                message: "Test API",
                version: "1.0.0",
                timestamp: "2025-08-12T20:00:00.000Z"
            },
            healthCheck: {
                status: "healthy",
                timestamp: "2025-08-12T20:00:00.000Z",
                uptime: 3600
            }
        };

        // Configure the mock for the current test
        vi.mocked(ApiService.testConnection).mockResolvedValue(mockResult);

        // Act: Render and trigger the test
        render(<ApiTestComponent />);

        const button = screen.getByRole("button");
        fireEvent.click(button);

        // Assert: Success UI is shown and key fields are rendered with expected values
        await waitFor(() => {
            expect(screen.getByTestId("success-message")).toBeInTheDocument();
        });

        expect(screen.getByTestId("api-message")).toHaveTextContent(
            "Message: Test API"
        );
        expect(screen.getByTestId("api-version")).toHaveTextContent(
            "Version: 1.0.0"
        );
        expect(screen.getByTestId("backend-url")).toHaveTextContent(
            "Backend URL: http://localhost:3001"
        );
        expect(screen.getByTestId("health-status")).toHaveTextContent(
            "Health Status: healthy"
        );
        expect(screen.getByTestId("uptime")).toHaveTextContent("Uptime: 3600s");
    });

    it("displays success message without health data when health check is not available", async () => {
        // Arrange: Simulate a successful API info but missing health data. We intentionally
        // set healthCheck to null to verify the component hides health-related UI.
        const mockResult = {
            apiInfo: {
                message: "Test API",
                version: "1.0.0",
                timestamp: "2025-08-12T20:00:00.000Z"
            },
            // Simulate missing health data. This breaks the strict service type, but is acceptable
            // in this UX test to verify optional UI behavior. We disable the no-explicit-any rule
            // for this line to avoid adding intrusive types solely for a negative-path test case.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            healthCheck: null as any
        };

        // Configure the mock for the current test
        vi.mocked(ApiService.testConnection).mockResolvedValue(mockResult);

        // Act: Render and trigger the test
        render(<ApiTestComponent />);

        const button = screen.getByRole("button");
        fireEvent.click(button);

        // Assert: Success message is shown, but health UI is absent
        await waitFor(() => {
            expect(screen.getByTestId("success-message")).toBeInTheDocument();
        });

        expect(screen.getByTestId("api-message")).toHaveTextContent(
            "Message: Test API"
        );
        expect(screen.queryByTestId("health-status")).not.toBeInTheDocument();
        expect(screen.queryByTestId("uptime")).not.toBeInTheDocument();
    });

    it("displays error message when connection test fails", async () => {
        // Arrange: Simulate a rejected service call with a specific error message
        const errorMessage = "Network error occurred";
        vi.mocked(ApiService.testConnection).mockRejectedValue(
            new Error(errorMessage)
        );

        // Act: Render and trigger the test
        render(<ApiTestComponent />);

        const button = screen.getByRole("button");
        fireEvent.click(button);

        // Assert: Error UI is shown with the propagated error text
        await waitFor(() => {
            expect(screen.getByTestId("error-message")).toBeInTheDocument();
        });

        expect(screen.getByTestId("error-text")).toHaveTextContent(
            errorMessage
        );
        expect(screen.queryByTestId("success-message")).not.toBeInTheDocument();
    });

    it("handles unknown error types gracefully", async () => {
        // Arrange: Some code paths might reject with a non-Error value. Ensure the component
        // handles such cases and shows a generic message.
        vi.mocked(ApiService.testConnection).mockRejectedValue("Unknown error");

        // Act: Render and trigger the test
        render(<ApiTestComponent />);

        const button = screen.getByRole("button");
        fireEvent.click(button);

        // Assert: Generic error message appears
        await waitFor(() => {
            expect(screen.getByTestId("error-message")).toBeInTheDocument();
        });

        expect(screen.getByTestId("error-text")).toHaveTextContent(
            "Unknown error occurred"
        );
    });

    it("clears previous results when starting a new test", async () => {
        // First, simulate a successful test
        const mockResult = {
            apiInfo: {
                message: "Test API",
                version: "1.0.0",
                timestamp: "2025-08-12T20:00:00.000Z"
            },
            healthCheck: {
                status: "healthy",
                timestamp: "2025-08-12T20:00:00.000Z",
                uptime: 3600
            }
        };

        // Success on the first click
        vi.mocked(ApiService.testConnection).mockResolvedValue(mockResult);

        // Act: Render and trigger the first successful test
        render(<ApiTestComponent />);

        const button = screen.getByRole("button");
        fireEvent.click(button);

        // Assert: Success message is shown after first run
        await waitFor(() => {
            expect(screen.getByTestId("success-message")).toBeInTheDocument();
        });

        // Now simulate an error on the next test
        vi.mocked(ApiService.testConnection).mockRejectedValue(
            new Error("New error")
        );

        // Act: Click again to start a fresh run
        fireEvent.click(button);

        // Assert: Previous success is cleared and error message appears
        await waitFor(() => {
            expect(screen.getByTestId("error-message")).toBeInTheDocument();
        });

        expect(screen.queryByTestId("success-message")).not.toBeInTheDocument();
    });

    it("button returns to initial state after successful test", async () => {
        // Arrange: Simulate a successful service call
        const mockResult = {
            apiInfo: {
                message: "Test API",
                version: "1.0.0",
                timestamp: "2025-08-12T20:00:00.000Z"
            },
            healthCheck: {
                status: "healthy",
                timestamp: "2025-08-12T20:00:00.000Z",
                uptime: 3600
            }
        };

        // Configure the mock for the current test
        vi.mocked(ApiService.testConnection).mockResolvedValue(mockResult);

        // Act: Render and trigger the test
        render(<ApiTestComponent />);

        const button = screen.getByRole("button");
        fireEvent.click(button);

        // Assert: After completing, the button label and disabled state return to normal
        await waitFor(() => {
            expect(button).toHaveTextContent("Test Backend Connection");
            expect(button).not.toBeDisabled();
        });
    });
});
