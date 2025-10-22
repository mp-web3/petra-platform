import { IsEmail, IsBoolean, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateCheckoutSessionDto {
    @IsString()
    @MinLength(1)
    planId: string;

    @IsEmail()
    email: string;

    @IsBoolean()
    acceptedTos: boolean;

    @IsBoolean()
    @IsOptional()
    marketingOptIn?: boolean;

    @IsString()
    @MinLength(1)
    disclosureVersion: string;
}

