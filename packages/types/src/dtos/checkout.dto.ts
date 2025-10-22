export interface CreateCheckoutSessionDto {
    planId: string;
    email: string;
    acceptedTos: boolean;
    marketingOptIn?: boolean;
    disclosureVersion: string;
}

export interface CheckoutSessionResponse {
    url: string;
}

