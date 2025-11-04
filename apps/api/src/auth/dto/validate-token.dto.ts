import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO for validating activation token
 * Used to check if token is valid without activating the account
 */
export class ValidateTokenDto {
    @IsString()
    @IsNotEmpty({ message: 'Token is required' })
    token: string;

    @IsString()
    @IsNotEmpty({ message: 'User ID is required' })
    userId: string;
}

