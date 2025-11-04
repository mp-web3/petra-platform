import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Authentication Guard
 * 
 * Protects routes by requiring valid JWT token.
 * 
 * Usage:
 * @UseGuards(JwtAuthGuard)
 * async myProtectedRoute(@Request() req) {
 *   const user = req.user; // User from JWT token
 * }
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    /**
     * Handle authentication errors
     */
    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw err || new Error('Unauthorized');
        }
        return user;
    }
}
