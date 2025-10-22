import { OrderStatus } from '../enums';

export interface Order {
    id: string;
    userId?: string;
    planId: string;
    amount: number;
    currency: string;
    status: OrderStatus;
    stripeSessionId: string;
    stripePaymentIntentId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Consent {
    id: string;
    orderId: string;
    tosAccepted: boolean;
    marketingOptIn?: boolean;
    disclosureVersion: string;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
}

