import { IsString, IsNotEmpty, MinLength, Matches, IsOptional } from 'class-validator';

/**
 * DTO for account activation
 * User sets their name and password to activate account
 */
export class ActivateAccountDto {
    @IsString()
    @IsNotEmpty({ message: 'Token is required' })
    token: string;

    @IsString()
    @IsNotEmpty({ message: 'User ID is required' })
    userId: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        { message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number' }
    )
    password: string;
}
