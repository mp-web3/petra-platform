import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * DTO for account activation
 * User sets their name and password to activate account
 */
export class ResendActivationDto {
    @IsEmail()
    @IsNotEmpty()
    email: string
}
