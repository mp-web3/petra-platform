'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api-client';
import type { LoginResponse } from '@petra/api-client';

interface User {
    id: string;
    email: string;
    name: string | null;
    role: string;
    emailVerified: boolean;
    activatedAt: Date | null;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const loadUser = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
            if (token) {
                // Validate token by trying to fetch subscription
                // If token is valid, we'll get subscription (or no subscription)
                // If invalid, we'll get 401 and can clear token
                try {
                    apiClient.setAuthToken(token);
                    // Try to fetch subscription to validate token
                    await apiClient.subscription.getSubscription();
                    // Token is valid - user will be loaded from protected routes
                    // For now, we'll just mark as authenticated
                    setLoading(false);
                } catch (error: any) {
                    // Token invalid or expired
                    if (error.response?.status === 401) {
                        apiClient.clearAuthToken();
                    }
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response: LoginResponse = await apiClient.auth.login({ email, password });
            setUser(response.user);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const logout = () => {
        apiClient.auth.logout();
        setUser(null);
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
