import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    // Token expiration: 1 day (in milliseconds)
    private readonly TOKEN_EXPIRATION_MS = 1 * 24 * 60 * 60 * 1000;

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private emailService: EmailService
    ) { }

    /**
     * Generates a secure activation token and stores it in the database
     * 
     * @param userId - The user ID to generate token for
     * @returns The generated token string
     */
    async generateActivationToken(userId: string): Promise<string> {
        // Generate cryptographically secure random token
        // 32 bytes = 256 bits of entropy (very secure)
        const tokenBytes = randomBytes(32);
        const token = tokenBytes.toString('base64url'); // Base64URL encoding (URL-safe)

        // Calculate expiration date (7 days from now)
        const expiresAt = new Date(Date.now() + this.TOKEN_EXPIRATION_MS);

        // Store token in database
        await this.prisma.activationToken.create({
            data: {
                token,
                userId,
                expiresAt,
            },
        });

        return token;
    }

    /**
     * Validates an activation token and returns the associated user
     * 
     * @param token - The activation token to validate
     * @param userId - The user ID associated with the token
     * @returns The user if token is valid
     * @throws BadRequestException if token is invalid, expired, or already used
     */
    async validateActivationToken(token: string, userId: string) {
        // Find token in database
        const activationToken = await this.prisma.activationToken.findUnique({
            where: { token },
            include: { user: true },
        });

        // Check if token exists
        if (!activationToken) {
            throw new BadRequestException('Invalid activation token');
        }

        // Check if token belongs to the correct user
        if (activationToken.userId !== userId) {
            throw new BadRequestException('Token does not match user ID');
        }

        // Check if token has expired
        if (activationToken.expiresAt < new Date()) {
            throw new BadRequestException('Activation token has expired. Please request a new activation link.');
        }

        // Check if token has already been used
        if (activationToken.usedAt) {
            throw new BadRequestException('This activation link has already been used. Please request a new one.');
        }

        // Check if user still needs activation (password not set)
        if (activationToken.user.password) {
            throw new BadRequestException('Account is already activated');
        }

        return activationToken.user;
    }

    /**
     * Activates a user account by setting their password and name
     * 
     * @param dto - Activation data (token, userId, password, optional name)
     * @returns The activated user
     */
    async activateAccount(dto: ActivateAccountDto) {
        // Validate token and get user
        const user = await this.validateActivationToken(dto.token, dto.userId);

        // Hash password using bcrypt
        // Salt rounds: 10 (good balance between security and performance)
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Update user: set password, name, and activation status
        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                name: dto.name || user.name,
                emailVerified: true,
                activatedAt: new Date(),
            },
        });

        // Mark token as used
        await this.prisma.activationToken.update({
            where: { token: dto.token },
            data: { usedAt: new Date() },
        });

        // Update order sign-up status
        await this.prisma.order.updateMany({
            where: {
                userId: user.id,
                signUpStatus: 'PENDING',
            },
            data: {
                signUpStatus: 'ACTIVATED',
            },
        });

        // Return user without password
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }

    /**
     * Invalidates all existing activation tokens for a user
     * Useful when sending a new activation email
     * 
     * @param userId - The user ID
     */
    async invalidateUserTokens(userId: string): Promise<void> {
        // Mark all unused tokens as expired (by setting usedAt)
        await this.prisma.activationToken.updateMany({
            where: {
                userId,
                usedAt: null,
            },
            data: {
                usedAt: new Date(), // Mark as used to invalidate
            },
        });
    }

    /**
     * Cleans up expired activation tokens (for cron job)
     * 
     * @returns Number of tokens deleted
     */
    async cleanupExpiredTokens(): Promise<number> {
        const result = await this.prisma.activationToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
        return result.count;
    }

    /**
     * Validates user credentials and returns JWT token
     * 
     * @param dto - Login credentials (email, password)
     * @returns JWT token and user info
     */
    async login(dto: LoginDto) {
        // Find user by email
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        // Check if user exists
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Check if account is activated
        if (!user.activatedAt || !user.password) {
            throw new UnauthorizedException('Account not activated. Please check your email for activation link.');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Generate JWT token
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };

        const token = this.jwtService.sign(payload, {
            expiresIn: '30d', // Token expires in 30 days
        });

        // Return user without password
        const { password, ...userWithoutPassword } = user;

        return {
            access_token: token,
            user: userWithoutPassword,
        };
    }

    /**
     * Validates JWT token and returns user
     * 
     * Used internally to get user from token
     * 
     * @param token - JWT token
     * @returns User object
     */
    async validateToken(token: string) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    emailVerified: true,
                    activatedAt: true,
                },
            });

            if (!user || !user.activatedAt) {
                throw new UnauthorizedException('Invalid token');
            }

            return user;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    async resendActivationEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return {
                success: true,
                message: 'If account exists, email sent'
            }
        }

        if (user.activatedAt) {
            throw new BadRequestException('Account is already activated');
        }

        await this.invalidateUserTokens(user.id);

        const newToken = await this.generateActivationToken(user.id);

        // Send activation email (orderId is optional - can be null for direct signups)
        // For resend, we don't require an order - supports future direct signups without orders
        const activationResult = await this.emailService.sendAccountActivation(
            email,
            user.id,
            newToken,
            null // No orderId for resend - user might not have an order (future feature)
        );

        return {
            success: true,
            message: 'If account exists and is not activated, activation email has been sent',
            emailLogId: activationResult.emailLogId,
        };
    }
}
