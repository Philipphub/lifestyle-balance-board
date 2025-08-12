export interface ApiResponse {
    message: string;
    version: string;
    timestamp: string;
}

export interface HealthResponse {
    status: string;
    timestamp: string;
    uptime: number;
}

export interface ConnectionTestResult {
    apiInfo: ApiResponse;
    healthCheck: HealthResponse;
}

export class ApiService {
    static getBaseUrl(): string {
        return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
    }

    static async getApiInfo(): Promise<ApiResponse> {
        const response = await fetch(this.getBaseUrl());

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    static async getHealthCheck(): Promise<HealthResponse> {
        const response = await fetch(`${this.getBaseUrl()}/api/health`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    static async testConnection(): Promise<ConnectionTestResult> {
        const [apiInfo, healthCheck] = await Promise.all([
            this.getApiInfo(),
            this.getHealthCheck()
        ]);

        return {
            apiInfo,
            healthCheck
        };
    }
}
