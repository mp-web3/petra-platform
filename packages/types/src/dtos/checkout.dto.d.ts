export interface CreateCheckoutSessionDto {
    planId: string;
    email: string;
    acceptedTos: boolean;
    marketingOptIn?: boolean;
    disclosureTosVersion: string;
}
export interface CheckoutSessionResponse {
    url: string;
}
//# sourceMappingURL=checkout.dto.d.ts.map