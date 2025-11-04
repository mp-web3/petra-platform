import { ApiClient, ApiClientConfig } from './client';
import { CheckoutApi } from './endpoints/checkout';
import { HealthApi } from './endpoints/health';
import { AuthApi } from './endpoints/auth';
import { SubscriptionApi } from './endpoints/subscription';

export class PetraApiClient {
    private client: ApiClient;
    public checkout: CheckoutApi;
    public health: HealthApi;
    public auth: AuthApi;
    public subscription: SubscriptionApi;

    constructor(config: ApiClientConfig) {
        this.client = new ApiClient(config);
        this.checkout = new CheckoutApi(this.client);
        this.health = new HealthApi(this.client);
        this.auth = new AuthApi(this.client);
        this.subscription = new SubscriptionApi(this.client);
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
export * from './endpoints/auth';
export * from './endpoints/subscription';
export type { CreateCheckoutSessionDto, CheckoutSessionResponse } from '@petra/types';

