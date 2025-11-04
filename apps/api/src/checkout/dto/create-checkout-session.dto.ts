import { IsEmail, IsBoolean, IsString, MinLength, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCheckoutSessionDto {
    @IsString()
    @MinLength(1)
    planId: string;

    @IsEmail()
    email: string;

    @IsBoolean()
    acceptedTos: boolean;

    @IsString()
    @MinLength(1)
    disclosureTosVersion: string;

    @IsBoolean()
    acceptedPrivacy: boolean;

    @IsString()
    @MinLength(1)
    disclosurePrivacyVersion: string;

    @IsBoolean()
    @IsOptional()
    marketingOptIn?: boolean;

    @IsString()
    @IsNotEmpty()
    'h-captcha-response': string;
}

