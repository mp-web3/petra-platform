import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

/**
 * DTO for user login
 */
export class LoginDto {
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}
