import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface ApiClientConfig {
    baseURL: string;
    timeout?: number;
}

export class ApiClient {
    private axiosInstance: AxiosInstance;

    constructor(config: ApiClientConfig) {
        this.axiosInstance = axios.create({
            baseURL: config.baseURL,
            timeout: config.timeout || 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor
        this.axiosInstance.interceptors.request.use(
            (config) => {
                // Add auth token if available
                const token = this.getAuthToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                // Log error details for debugging
                if (error.response) {
                    // Server responded with error status
                    console.error('API Error Response:', {
                        status: error.response.status,
                        statusText: error.response.statusText,
                        data: error.response.data,
                        url: error.config?.url,
                    });
                } else if (error.request) {
                    // Request made but no response (network error, CORS, etc.)
                    console.error('API Network Error:', {
                        message: error.message,
                        code: error.code,
                        url: error.config?.url,
                    });
                } else {
                    // Error setting up request
                    console.error('API Request Setup Error:', error.message);
                }

                // Handle errors globally
                if (error.response?.status === 401) {
                    // Handle unauthorized
                    this.handleUnauthorized();
                }
                return Promise.reject(error);
            }
        );
    }

    private getAuthToken(): string | null {
        // TODO: Implement token storage (localStorage, cookies, etc.)
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token');
        }
        return null;
    }

    private handleUnauthorized() {
        // TODO: Implement unauthorized handler (redirect to login, etc.)
        console.warn('Unauthorized access - token might be expired');
    }

    public setAuthToken(token: string) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
        }
    }

    public clearAuthToken() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
        }
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.get<T>(url, config);
        return response.data;
    }

    async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.post<T>(url, data, config);
        return response.data;
    }

    async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.put<T>(url, data, config);
        return response.data;
    }

    async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.patch<T>(url, data, config);
        return response.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.delete<T>(url, config);
        return response.data;
    }
}

