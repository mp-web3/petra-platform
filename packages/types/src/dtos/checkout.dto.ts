export interface CreateCheckoutSessionDto {
    planId: string;
    email: string;
    acceptedTos: boolean;
    acceptedPrivacy: boolean;
    marketingOptIn?: boolean;
    disclosureTosVersion: string;
    disclosurePrivacyVersion: string;
}

export interface CheckoutSessionResponse {
    url: string;
}

