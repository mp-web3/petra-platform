import { createApiClient } from '@petra/api-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = createApiClient(API_URL);
