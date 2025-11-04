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
    'h-captcha-response': string;
}

export interface ResendActivationDto {
    email: string;
    'h-captcha-response': string;
}

export interface ResendActivationResponse {
    success: boolean;
    message: string;
    emailLogId?: string;
}

export interface ValidateTokenResponse {
    valid: boolean;
    expired?: boolean;
    message: string;
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
    constructor(private client: ApiClient) { }

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
     * Validate activation token (without activating)
     */
    async validateToken(token: string, userId: string): Promise<ValidateTokenResponse> {
        return this.client.get<ValidateTokenResponse>('/api/auth/validate-token', {
            params: { token, userId },
        });
    }

    /**
     * Activate account with token
     */
    async activateAccount(dto: ActivateAccountDto): Promise<ActivateAccountResponse> {
        return this.client.post<ActivateAccountResponse>('/api/auth/activate', dto);
    }

    /**
     * Resend activation email
     */
    async resendActivation(dto: ResendActivationDto): Promise<ResendActivationResponse> {
        return this.client.post<ResendActivationResponse>('/api/auth/resend-activation', dto);
    }

    /**
     * Logout (clears token)
     */
    logout() {
        this.client.clearAuthToken();
    }
}
