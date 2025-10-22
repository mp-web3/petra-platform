'use client';

import { Box } from '@petra/ui';
import { useEffect, useRef } from 'react';
import {
  Hero,
  SectionWithImageAndText,
  Steps,
  SubscriptionPlanSection,
  BenefitsSection,
  AppAccessSection,
  FAQsSection,
} from '@/components';
import { plansWomanPremium, toPreviewHref } from '@/lib/plans';

export default function CoachingDonnaPage() {
  const subscriptionPlanSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToSubscriptionPlanSection = () => {
    subscriptionPlanSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (window.location.hash === '#piani') {
      setTimeout(() => {
        subscriptionPlanSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  return (
    <Box>
      <Hero
        backgroundImage="/images/donna-coaching-online-trx.jpg"
        titleLine1="coaching donna"
        titleLine2="online"
        buttonText="inizia ora"
        buttonOnClick={scrollToSubscriptionPlanSection}
        objectionReducingInfoText="Insieme costruiamo il tuo percorso: coaching individuale e sostegno continuo da donna a donna per il cambiamento che hai sempre desiderato."
      />

      <SectionWithImageAndText
        heading="il mio programma fa per te?"
        imageUrl="/images/giovane-donna-cliente-tipo-coaching-online.jpg"
        imageAlt="Giovane donna coaching online"
        text={`Sogni di iniziare ad allenarti ma non sai come muovere i primi passi? Ti senti persa quando varchi la soglia della palestra? Ti alleni da tempo senza vedere i risultati che desideri? Cerchi un programma specificamente pensato per il corpo e le esigenze femminili? Vuoi spingerti oltre i tuoi limiti e scoprire di cosa sei davvero capace? Vuoi rimetterti in forma e sentirti bene con te stessa? Se ti riconosci in almeno una di queste domande, sei nel posto giusto. Il mio coaching è nato proprio per rispondere a questi bisogni, per offrirti la guida e il supporto che hai sempre cercato.`}
      />

      <Steps
        heading="Passo a passo la tua trasformazione assieme a me"
        items={[
          {
            number: 1,
            title: 'STEP 1',
            subtitle: 'Consulenza video iniziale',
            bullets: [
              'Ti ascolterò per conoscere la tua storia e le tue esperienze passate',
              'Analizzeremo insieme il tuo punto di partenza attuale',
              'Definiremo il percorso più adatto a te',
            ],
          },
          {
            number: 2,
            title: 'STEP 2',
            subtitle: 'Ricevi il tuo piano personalizzato',
            bullets: [
              'Piano di allenamento creato su misura per te',
              'Video tutorial per ogni esercizio',
              'Accesso immediato tramite app',
            ],
          },
          {
            number: 3,
            title: 'STEP 3',
            subtitle: 'Inizia la tua trasformazione',
            bullets: [
              'Supporto costante via WhatsApp',
              'Monitoraggio progressi settimanale',
              'Aggiustamenti personalizzati quando necessario',
            ],
          },
        ]}
      />

      <Box ref={subscriptionPlanSectionRef} id="piani">
        <SubscriptionPlanSection
          header="Scegli il tuo piano"
          subHeader="Tutti i piani includono supporto personalizzato e accesso all'app"
          plans={plansWomanPremium.map((plan) => ({
            title: plan.title,
            subtitle: plan.subtitle,
            priceLabel: plan.priceLabel,
            ctaText: 'Inizia Ora',
            ctaHref: toPreviewHref(plan.slug),
            features: plan.features,
            highlighted: plan.highlighted,
          }))}
        />
      </Box>

      <BenefitsSection
        heading="I vantaggi del"
        highlight="coaching online"
        items={[
          {
            iconSrc: '/icons/chat_primary.svg',
            iconAlt: 'Chat',
            title: 'Supporto Personalizzato',
            description: 'Assistenza costante via WhatsApp per ogni tua domanda',
          },
          {
            iconSrc: '/icons/videocam_primary.svg',
            iconAlt: 'Video',
            title: 'Video Tutorial',
            description: 'Esecuzione corretta di ogni esercizio spiegata in dettaglio',
          },
          {
            iconSrc: '/icons/star_border_primary.svg',
            iconAlt: 'Star',
            title: 'Programmi Su Misura',
            description: 'Piani di allenamento creati specificamente per i tuoi obiettivi',
          },
        ]}
        ctaText="Scegli il Tuo Piano"
        onCtaClick={scrollToSubscriptionPlanSection}
      />

      <AppAccessSection
        heading="accesso all'app"
        features={[
          {
            featureIconSrc: '/icons/video_library_primary.svg',
            featureIconAlt: 'Video Library',
            featureTitle: 'Video Esercizi',
            featureText: 'Tutorial completi per ogni movimento',
          },
          {
            featureIconSrc: '/icons/edit_note_primary.svg',
            featureIconAlt: 'Notes',
            featureTitle: 'Piano Personalizzato',
            featureText: 'Il tuo programma sempre a portata di mano',
          },
          {
            featureIconSrc: '/icons/format_list_numbered_primary.svg',
            featureIconAlt: 'Progress',
            featureTitle: 'Traccia Progressi',
            featureText: 'Monitora i tuoi risultati giorno per giorno',
          },
        ]}
        mockupImageSrc="/images/coachplus-iphone-mockup.png"
        mockupImageAlt="CoachPlus App"
      />

      <FAQsSection
        heading="Domande"
        highlight="Frequenti"
        items={[
          {
            q: 'Quanto tempo devo dedicare agli allenamenti?',
            a: 'In media 3-4 sessioni a settimana di 45-60 minuti. Il piano è flessibile e adattabile ai tuoi impegni.',
          },
          {
            q: 'Posso allenarmi a casa?',
            a: 'Assolutamente sì! Posso creare programmi per casa con attrezzatura minima o per palestra, in base alle tue esigenze.',
          },
          {
            q: 'Come funziona il supporto WhatsApp?',
            a: 'Avrai accesso diretto a me via WhatsApp per domande, dubbi o consigli durante tutto il percorso. I clienti Premium hanno priorità nelle risposte.',
          },
          {
            q: 'Posso cambiare piano se non mi trovo bene?',
            a: 'Certamente! Il tuo benessere è la priorità. Possiamo sempre adattare il programma o cambiare piano.',
          },
        ]}
      />
    </Box>
  );
}

