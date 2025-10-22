import { SubscriptionPlanType, PlanDuration } from '@petra/types';

export const PLAN_CONFIGS = {
    [SubscriptionPlanType.WOMAN_STARTER]: {
        name: 'Starter Woman',
        features: ['Basic workouts', 'Nutrition guides', 'Email support'],
    },
    [SubscriptionPlanType.WOMAN_PREMIUM]: {
        name: 'Premium Woman',
        features: [
            'Personalized workouts',
            'Custom nutrition plans',
            'Priority chat support',
            'Video tutorials',
        ],
    },
    [SubscriptionPlanType.MAN_STARTER]: {
        name: 'Starter Man',
        features: ['Basic workouts', 'Nutrition guides', 'Email support'],
    },
    [SubscriptionPlanType.MAN_PREMIUM]: {
        name: 'Premium Man',
        features: [
            'Personalized workouts',
            'Custom nutrition plans',
            'Priority chat support',
            'Video tutorials',
        ],
    },
};

export const DURATION_LABELS = {
    [PlanDuration.WEEKS_6]: '6 Weeks',
    [PlanDuration.WEEKS_18]: '18 Weeks',
    [PlanDuration.WEEKS_36]: '36 Weeks',
};

