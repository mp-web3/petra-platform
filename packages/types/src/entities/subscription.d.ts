import { SubscriptionStatus, SubscriptionPlanType, PlanDuration } from '../enums';
export interface Subscription {
    id: string;
    userId: string;
    planType: SubscriptionPlanType;
    duration: PlanDuration;
    status: SubscriptionStatus;
    stripeSubscriptionId: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface PlanCatalog {
    id: string;
    title: string;
    subtitle: string;
    priceLabel: string;
    stripePriceId: string;
    active: boolean;
    planType: SubscriptionPlanType;
    duration: PlanDuration;
}
//# sourceMappingURL=subscription.d.ts.map