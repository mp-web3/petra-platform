'use client'

import { useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface HCaptchaProps {
    onVerify: (token: string) => void;
    onError: () => void;
}

export function HCaptchaWidget({ onVerify, onError }: HCaptchaProps) {
    const captchaRef = useRef<HCaptcha>(null);
    const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

    if (!siteKey) {
        return null;
    }

    return (
        <HCaptcha
            ref={captchaRef}
            sitekey={siteKey}
            onVerify={onVerify}
            onError={onError}
            theme='light'
        >
        </HCaptcha>
    )
}