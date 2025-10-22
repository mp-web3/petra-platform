export enum UserRole {
    CLIENT = 'CLIENT',
    COACH = 'COACH',
    ADMIN = 'ADMIN',
}

export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    CANCELLED = 'CANCELLED',
    PAST_DUE = 'PAST_DUE',
    TRIALING = 'TRIALING',
    INCOMPLETE = 'INCOMPLETE',
}

export enum SubscriptionPlanType {
    WOMAN_STARTER = 'WOMAN_STARTER',
    WOMAN_PREMIUM = 'WOMAN_PREMIUM',
    MAN_STARTER = 'MAN_STARTER',
    MAN_PREMIUM = 'MAN_PREMIUM',
}

export enum OrderStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

export enum PlanDuration {
    WEEKS_6 = '6W',
    WEEKS_18 = '18W',
    WEEKS_36 = '36W',
}

