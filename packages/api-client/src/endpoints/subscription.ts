import { ApiClient } from '../client';
import { Subscription } from '@petra/types';

export interface GetSubscriptionResponse {
    subscription: Subscription | null;
    hasSubscription: boolean;
}

export interface CancelSubscriptionResponse {
    success: boolean;
    message: string;
    subscription: Subscription;
}

export interface ReactivateSubscriptionResponse {
    success: boolean;
    message: string;
    subscription: Subscription;
}

export class SubscriptionApi {
    constructor(private client: ApiClient) { }

    /**
     * Get user's current subscription
     */
    async getSubscription(): Promise<GetSubscriptionResponse> {
        return this.client.get<GetSubscriptionResponse>('/api/subscription');
    }

    /**
     * Cancel subscription
     * @param cancelImmediately - If true, cancels immediately; if false, cancels at period end
     */
    async cancelSubscription(cancelImmediately: boolean = false): Promise<CancelSubscriptionResponse> {
        return this.client.post<CancelSubscriptionResponse>('/api/subscription/cancel', {
            cancelImmediately,
        });
    }

    /**
     * Reactivate cancelled subscription
     */
    async reactivateSubscription(): Promise<ReactivateSubscriptionResponse> {
        return this.client.post<ReactivateSubscriptionResponse>('/api/subscription/reactivate');
    }
}
