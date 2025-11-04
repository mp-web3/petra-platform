import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from 'express';

/**
 * Custom exception filter for rate limiting errors
 * 
 * Provides user-friendly error messages when rate limits are exceeded.
 * Returns a 429 Too Many Requests status with a clear message and retry-after header.
 */
@Catch(ThrottlerException)
export class ThrottleExceptionFilter implements ExceptionFilter {
    catch(exception: ThrottlerException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = HttpStatus.TOO_MANY_REQUESTS;

        // Calculate retry after (typically 60 seconds for most endpoints)
        const retryAfter = 60; // seconds

        response.status(status).json({
            statusCode: status,
            message: 'Too many requests. Please try again later.',
            error: 'Too Many Requests',
            retryAfter, // seconds until user can retry
        });
    }
}

