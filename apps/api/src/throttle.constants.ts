/**
 * Throttle rate limiting configurations
 * 
 * These constants define rate limits for different throttle types.
 * Use these constants in both app.module.ts and controller decorators
 * to ensure consistency.
 * 
 * All time values (ttl) are in milliseconds.
 */

export const THROTTLE_CONFIG = {
    // Global default limit applied to all endpoints
    default: {
        ttl: 60000, // 60 seconds (1 minute)
        limit: 100, // Max 100 requests per minute per IP
    },
    // Strict limits for sensitive endpoints
    strict: {
        ttl: 3600000, // 3600 seconds (1 hour)
        limit: 10, // Max 10 requests per hour per IP
    },
    // Authentication endpoints
    auth: {
        login: {
            ttl: 60000, // 1 minute
            limit: 5, // 5 requests per minute (prevent brute force)
        },
        activate: {
            ttl: 60000, // 1 minute
            limit: 5, // 5 requests per minute (prevent abuse)
        },
        resendActivation: {
            ttl: 3600000, // 1 hour
            limit: 3, // 3 requests per hour (prevent email spam)
        },
    },
    // Checkout endpoints
    checkout: {
        sessions: {
            ttl: 60000, // 1 minute
            limit: 10, // 10 requests per minute (prevent checkout abuse)
        },
    },
    // Subscription endpoints (authenticated users)
    subscription: {
        ttl: 60000, // 1 minute
        limit: 30, // 30 requests per minute (authenticated users)
    },
    // Email endpoints
    email: {
        test: {
            ttl: 60000, // 1 minute
            limit: 3, // 3 requests per minute (test endpoint)
        },
        status: {
            ttl: 60000, // 1 minute
            limit: 60, // 60 requests per minute (health check)
        },
    },
} as const;

