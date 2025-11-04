'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createApiClient } from '@petra/api-client';
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
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const apiClient = createApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

    // Check if user is authenticated on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check if token exists in localStorage
                if (typeof window !== 'undefined') {
                    const token = localStorage.getItem('auth_token');
                    const storedUser = localStorage.getItem('auth_user');
                    
                    if (token && storedUser) {
                        // Restore user from localStorage
                        try {
                            const userData = JSON.parse(storedUser);
                            // Validate token by making a protected request
                            await apiClient.subscription.getSubscription();
                            // Token is valid, restore user
                            setUser(userData);
                        } catch (error) {
                            // Token is invalid, clear everything
                            apiClient.clearAuthToken();
                            localStorage.removeItem('auth_user');
                            setUser(null);
                        }
                    } else {
                        // No token or user data, ensure clean state
                        apiClient.clearAuthToken();
                        localStorage.removeItem('auth_user');
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error('Auth check error:', error);
                apiClient.clearAuthToken();
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth_user');
                }
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await apiClient.auth.login({ email, password });
            setUser(response.user);
            // Store user in localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth_user', JSON.stringify(response.user));
            }
        } catch (error: any) {
            throw error;
        }
    };

    const logout = () => {
        apiClient.auth.logout();
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_user');
        }
        setUser(null);
    };

    const refreshUser = async () => {
        // In a real app, you'd fetch user data from a /me endpoint
        // For now, we'll just check if token is still valid
        try {
            await apiClient.subscription.getSubscription();
        } catch (error) {
            // Token is invalid
            logout();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                logout,
                refreshUser,
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

