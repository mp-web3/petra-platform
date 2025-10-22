import { ApiClient, ApiClientConfig } from './client';
import { CheckoutApi } from './endpoints/checkout';
import { HealthApi } from './endpoints/health';

export class PetraApiClient {
    private client: ApiClient;
    public checkout: CheckoutApi;
    public health: HealthApi;

    constructor(config: ApiClientConfig) {
        this.client = new ApiClient(config);
        this.checkout = new CheckoutApi(this.client);
        this.health = new HealthApi(this.client);
    }

    // Expose auth methods
    setAuthToken(token: string) {
        this.client.setAuthToken(token);
    }

    clearAuthToken() {
        this.client.clearAuthToken();
    }
}

// Factory function for easy instantiation
export function createApiClient(baseURL: string): PetraApiClient {
    return new PetraApiClient({ baseURL });
}

// Export types
export * from './client';
export type { CreateCheckoutSessionDto, CheckoutSessionResponse } from '@petra/types';

