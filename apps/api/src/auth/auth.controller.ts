import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { ResendActivationDto } from './dto/resend-activation.dto';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';
import { THROTTLE_CONFIG } from '../throttle.constants';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * POST /api/auth/activate
     * 
     * Activates a user account by validating the activation token
     * and setting the user's password and name.
     * Notice: Activation token expires after 24hours.
     * 
     * Expected flow:
     * 1. User receives activation email with token and userId
     * 2. User clicks link: /activate?token=xxx&userId=yyy
     * 3. Frontend calls this endpoint with token, userId, password, and optional name
     * 4. Account is activated and user can log in
     * 
     * @param dto - Activation data
     * @returns User object (without password)
     */
    @Post('activate')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: THROTTLE_CONFIG.auth.activate })
    async activateAccount(@Body() dto: ActivateAccountDto) {
        const user = await this.authService.activateAccount(dto);
        return {
            success: true,
            message: 'Account activated successfully',
            user,
        };
    }

    /**
     * POST /api/auth/activate
     * Activates a user account by sending a new activation token and validating itvalidating the activation token
     * and setting the user's password and name.
     * Notice: Activation token expires after 24hours.
     * 
     * @param dto - Activation data
     * @returns User object (without password)
     */
    @Post('resend-activation')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: THROTTLE_CONFIG.auth.resendActivation })
    async resendActivation(@Body() dto: ResendActivationDto) {
        const result = await this.authService.resendActivationEmail(dto.email);
        return result;
    }


    /**
     * POST /api/auth/login
     * 
     * Authenticates user with email and password.
     * Returns JWT token for accessing protected routes.
     * 
     * @param dto - Login credentials (email, password)
     * @returns JWT token and user info
     */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: THROTTLE_CONFIG.auth.login })
    async login(@Body() dto: LoginDto) {
        const result = await this.authService.login(dto);
        return {
            success: true,
            message: 'Login successful',
            ...result,
        };
    }
}
