import { ApiClient } from '../client';
import { CreateCheckoutSessionDto, CheckoutSessionResponse } from '@petra/types';

export class CheckoutApi {
    constructor(private client: ApiClient) { }

    async createCheckoutSession(
        dto: CreateCheckoutSessionDto,
        idempotencyKey?: string
    ): Promise<CheckoutSessionResponse> {
        const headers = idempotencyKey ? { 'x-idempotency-key': idempotencyKey } : undefined;

        return this.client.post<CheckoutSessionResponse>(
            '/api/checkout/sessions',
            dto,
            { headers }
        );
    }
}

