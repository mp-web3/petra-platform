import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

/**
 * JWT Strategy
 * 
 * Validates JWT tokens and extracts user information.
 * Used by JwtAuthGuard to protect routes.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService
    ) {
        super({
            // Extract JWT from Authorization header: "Bearer <token>"
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // Ignore expiration - we handle it in validate()
            ignoreExpiration: false,
            // Secret key from environment
            secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key-change-in-production',
        });
    }

    /**
     * Validate JWT payload
     * 
     * Called after JWT is verified and decoded.
     * Returns user object that will be attached to request.user
     * 
     * @param payload - Decoded JWT payload (contains userId, email, etc.)
     * @returns User object (attached to request.user)
     */
    async validate(payload: any) {
        // Payload typically contains: { userId, email, iat, exp }
        const userId = payload.userId || payload.sub;

        if (!userId) {
            throw new UnauthorizedException('Invalid token payload');
        }

        // Fetch user from database to ensure they still exist
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                emailVerified: true,
                activatedAt: true,
                // Don't include password
            },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Check if account is activated
        if (!user.activatedAt || !user.emailVerified) {
            throw new UnauthorizedException('Account not activated');
        }

        // Return user object (attached to request.user in protected routes)
        return user;
    }
}
