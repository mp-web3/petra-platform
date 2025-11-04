import { ApiClient } from '../client';

export interface LoginDto {
    email: string;
    password: string;
}

export interface ActivateAccountDto {
    token: string;
    userId: string;
    password: string;
    name?: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    access_token: string;
    user: {
        id: string;
        email: string;
        name: string | null;
        role: string;
        emailVerified: boolean;
        activatedAt: Date | null;
    };
}

export interface ActivateAccountResponse {
    success: boolean;
    message: string;
    user: {
        id: string;
        email: string;
        name: string | null;
        role: string;
        emailVerified: boolean;
        activatedAt: Date | null;
    };
}

export class AuthApi {
    constructor(private client: ApiClient) {}

    /**
     * Login with email and password
     */
    async login(dto: LoginDto): Promise<LoginResponse> {
        const response = await this.client.post<LoginResponse>('/api/auth/login', dto);
        
        // Automatically store token
        if (response.access_token) {
            this.client.setAuthToken(response.access_token);
        }
        
        return response;
    }

    /**
     * Activate account with token
     */
    async activateAccount(dto: ActivateAccountDto): Promise<ActivateAccountResponse> {
        return this.client.post<ActivateAccountResponse>('/api/auth/activate', dto);
    }

    /**
     * Logout (clears token)
     */
    logout() {
        this.client.clearAuthToken();
    }
}
