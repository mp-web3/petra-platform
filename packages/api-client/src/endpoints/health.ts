import { ApiClient } from '../client';

export interface HealthResponse {
    ok: boolean;
    timestamp: string;
    environment: string;
}

export class HealthApi {
    constructor(private client: ApiClient) { }

    async check(): Promise<HealthResponse> {
        return this.client.get<HealthResponse>('/health');
    }
}

