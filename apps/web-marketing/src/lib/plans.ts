export type PlanSlug =
  | 'woman-premium-6w'
  | 'woman-premium-18w'
  | 'woman-premium-36w'
  | 'woman-starter-6w'
  | 'woman-starter-18w'
  | 'woman-starter-36w'
  | 'man-premium-6w'
  | 'man-premium-18w'
  | 'man-premium-36w'
  | 'man-starter-6w'
  | 'man-starter-18w'
  | 'man-starter-36w';

export type PlanFeatures = {
  id: string;
  label: string;
  checked?: boolean;
};

export type UiPlan = {
  slug: PlanSlug;
  title: string;
  subtitle?: string;
  priceLabel: string;
  highlighted?: boolean;
  features: PlanFeatures[];
};

export const plansWomanPremium: UiPlan[] = [
  {
    slug: 'woman-premium-6w',
    title: 'premium 6 settimane',
    subtitle: '6 settimane (+ di 1 mese)',
    priceLabel: '€150',
    highlighted: true,
    features: [
      {
        id: '1',
        label: '1 consulenza video iniziale',
      },
      {
        id: '2',
        label: '1 Piano di allenamento personalizzato',
      },
      {
        id: '3',
        label: '5 Consulenze video di monitoraggio',
      },
      {
        id: '4',
        label: 'Programmazione obiettivi quadrimestrale',
      },
      {
        id: '5',
        label: "Accesso all'app con il tuo piano personalizzato",
      },
      {
        id: '6',
        label: 'Video tutorial esercizi',
      },
      {
        id: '7',
        label: 'Supporto e assistenza costante via WhatsApp',
        checked: false,
      },
      {
        id: '8',
        label: 'Correzione video-esecuzioni esercizi',
        checked: false,
      },
    ],
  },
  {
    slug: 'woman-premium-18w',
    title: 'premium 18 settimane',
    subtitle: '18 settimane (+ di 4 mesi)',
    priceLabel: '€405',
    highlighted: true,
    features: [
      {
        id: '1',
        label: '1 consulenza video iniziale',
      },
      {
        id: '2',
        label: '6 Piani di allenamento personalizzato',
      },
      {
        id: '3',
        label: '5 Consulenze video di monitoraggio',
      },
      {
        id: '4',
        label: 'Programmazione obiettivi quadrimestrale',
      },
      {
        id: '5',
        label: "Accesso all'app con il tuo piano personalizzato",
      },
      {
        id: '6',
        label: 'Video tutorial esercizi',
      },
      {
        id: '7',
        label: 'Supporto e assistenza costante via WhatsApp | PRIORITARIA',
      },
      {
        id: '8',
        label: 'Correzione video-esecuzioni esercizi | PRIORITARIA',
      },
    ],
  },
  {
    slug: 'woman-premium-36w',
    title: 'premium 36 settimane',
    subtitle: '36 settimane (+ di 8 mesi)',
    priceLabel: '€750',
    highlighted: true,
    features: [
      {
        id: '1',
        label: '1 consulenza video iniziale',
      },
      {
        id: '2',
        label: '6 Piani di allenamento personalizzato',
      },
      {
        id: '3',
        label: '5 Consulenze video di monitoraggio',
      },
      {
        id: '4',
        label: 'Programmazione obiettivi quadrimestrale',
      },
      {
        id: '5',
        label: "Accesso all'app con il tuo piano personalizzato",
      },
      {
        id: '6',
        label: 'Video tutorial esercizi',
      },
      {
        id: '7',
        label: 'Supporto e assistenza costante via WhatsApp | PRIORITARIA',
      },
      {
        id: '8',
        label: 'Correzione video-esecuzioni esercizi | PRIORITARIA',
      },
    ],
  },
];

// TODO: Add plansWomanStarter, plansManPremium, plansManStarter

export function toPreviewHref(slug: PlanSlug) {
  return `/checkout/preview?plan=${slug}`;
}

export function getPlanBySlug(slug: string): UiPlan | undefined {
  const allPlans = [
    ...plansWomanPremium,
    // TODO: Add other plan arrays
  ];
  return allPlans.find((plan) => plan.slug === slug);
}

