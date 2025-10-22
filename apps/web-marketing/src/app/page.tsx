'use client';

import { Box, SimpleGrid, Container, Heading, VStack, Text } from '@petra/ui';
import { useRef } from 'react';
import {
  Hero,
  TwoColumnIntro,
  PersonalTrainingSection,
  BenefitsSection,
  Testimonials,
  SectionWithImageAndText,
  AppAccessSection,
  FAQsSection,
} from '@/components';

export default function HomePage() {
  const coachingGridRef = useRef<HTMLDivElement | null>(null);

  const scrollToCoachingGrid = () => {
    coachingGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const testimonials = [
    {
      id: '1',
      quote:
        'Petra mi ha aiutato a raggiungere i miei obiettivi in modo efficace. Il suo approccio personalizzato ha fatto la differenza!',
      author: 'Maria R.',
      role: 'Cliente Premium',
      avatarUrl: '/images/placeholders/avatar-user-testimonial-woman.webp',
    },
    {
      id: '2',
      quote:
        'Programma fantastico! Ho visto risultati incredibili in sole 6 settimane. Consiglio a tutti!',
      author: 'Giovanni L.',
      role: 'Cliente Starter',
      avatarUrl: '/images/placeholders/avatar-user-testimonial-man.webp',
    },
    {
      id: '3',
      quote:
        'Supporto costante e professionale. Petra è sempre disponibile per consigli e motivazione.',
      author: 'Francesca T.',
      role: 'Cliente Premium',
      avatarUrl: '/images/placeholders/avatar-user-testimonial-woman-2.webp',
    },
  ];

  return (
    <Box>
      <Hero
        backgroundImage="/images/hero-background-home.png"
        titleLine1="coaching online"
        titleLine2="personalizzato"
        buttonText="scopri di più"
        buttonOnClick={scrollToCoachingGrid}
        objectionReducingInfoText="Scopri i miei percorsi di coaching online personalizzati per uomo e donna"
      />

      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        mx="auto"
        alignItems="stretch"
        justifyItems="flex-start"
        w="100%"
        ref={coachingGridRef}
      >
        {/* Coaching Online Donna */}
        <TwoColumnIntro
          heading="coaching online donna"
          text="Il nostro percorso di coaching online inizia qui. Propongo percorsi su misura, che prevedono programmazione personalizzata e feedback periodici, e percorsi che comprendono supporto continuo e completo, supervisione tecnica e ottimizzazione dell'esecuzione degli esercizi."
          buttonText="esplora i piani donna"
          buttonHref="/coaching-donna-online#piani"
        />

        {/* Coaching Online Uomo */}
        <TwoColumnIntro
          heading="coaching online uomo"
          text="Il nostro percorso di coaching online inizia qui. Propongo percorsi su misura, che prevedono programmazione personalizzata e feedback periodici, e percorsi che comprendono supporto continuo e completo, supervisione tecnica e ottimizzazione dell'esecuzione degli esercizi."
          buttonText="esplora i piani uomo"
          buttonHref="/coaching-uomo-online#piani"
          variant="dark"
        />
      </SimpleGrid>

      {/* IL METODO */}
      <Box minH="auto" position="relative">
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundImage="url(/images/weights-background.jpg)"
          backgroundSize="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          zIndex={1}
        />

        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="hoverlay.default"
          zIndex={2}
        />

        <Container
          position="relative"
          zIndex={3}
          maxW="container.xl"
          px={[4, 6, 8]}
          py={[16, 20, 24]}
        >
          <VStack align="flex-start" gap={[6, 8, 10]} maxW="2xl">
            <Heading as="h2" textStyle="h2" color="text.onDefaultHoverlay">
              il metodo
            </Heading>
            <Text color="text.onDefaultHoverlay" fontSize="lg">
              Un approccio scientifico e personalizzato per raggiungere i tuoi obiettivi. Ogni
              programma è creato su misura per le tue esigenze specifiche.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Personal Training */}
      <PersonalTrainingSection
        heading="Personal Training"
        highlight="in palestra"
        subheading="Allenamenti personalizzati per massimizzare i tuoi risultati"
        features={[
          {
            iconSrc: '/icons/videocam_primary.svg',
            iconAlt: 'Video',
            title: 'Sessioni Individuali',
            description: 'Allenamenti one-to-one completamente personalizzati',
          },
          {
            iconSrc: '/icons/video_library_primary.svg',
            iconAlt: 'Video Library',
            title: 'Programmi Strutturati',
            description: 'Piani di allenamento progressivi e bilanciati',
          },
          {
            iconSrc: '/icons/star_border_primary.svg',
            iconAlt: 'Star',
            title: 'Risultati Garantiti',
            description: 'Monitoraggio costante dei tuoi progressi',
          },
        ]}
        ctaText="Scopri di più"
        ctaHref="/about"
      />

      {/* Benefits */}
      <BenefitsSection
        heading="I vantaggi del"
        highlight="coaching online"
        items={[
          {
            iconSrc: '/icons/calendar_month_primary.svg',
            iconAlt: 'Calendar',
            title: 'Flessibilità',
            description: 'Allenati quando e dove vuoi, secondo i tuoi ritmi',
          },
          {
            iconSrc: '/icons/chat_primary.svg',
            iconAlt: 'Chat',
            title: 'Supporto Costante',
            description: 'Assistenza continua via WhatsApp per rispondere a ogni tua domanda',
          },
          {
            iconSrc: '/icons/workspace_premium_primary.svg',
            iconAlt: 'Premium',
            title: 'Personalizzazione',
            description: 'Programmi creati su misura per i tuoi obiettivi specifici',
          },
        ]}
        ctaText="Inizia Ora"
        ctaHref="/coaching-donna-online#piani"
      />

      {/* Testimonials */}
      <Testimonials items={testimonials} />

      {/* Chi Sono */}
      <SectionWithImageAndText
        heading="Chi sono"
        imageUrl="/images/petra-primo-piano.webp"
        imageAlt="Petra - Personal Trainer"
        text="Sono Petra, personal trainer certificata con anni di esperienza nell'aiutare persone come te a raggiungere i loro obiettivi di fitness. Il mio approccio unisce scienza, passione e dedizione per creare programmi che funzionano davvero."
      />

      {/* App Access */}
      <AppAccessSection
        heading="accesso all'app"
        features={[
          {
            featureIconSrc: '/icons/videocam_primary.svg',
            featureIconAlt: 'Video',
            featureTitle: 'Video Esercizi',
            featureText: 'Tutorial completi per ogni esercizio',
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
        mockupImageSrc="/images/coachplus-app-mockup.jpg"
        mockupImageAlt="CoachPlus App"
      />

      {/* FAQs */}
      <FAQsSection
        heading="Domande"
        highlight="Frequenti"
        items={[
          {
            q: 'Come funziona il coaching online?',
            a: 'Dopo l\'acquisto, riceverai accesso alla piattaforma dove troverai il tuo piano di allenamento personalizzato, video tutorial e supporto diretto con me via WhatsApp.',
          },
          {
            q: 'Serve attrezzatura specifica?',
            a: 'Dipende dal tuo obiettivo. Posso creare programmi per casa con attrezzatura minima o per palestra. Lo discuteremo nella prima consulenza.',
          },
          {
            q: 'Quanto tempo serve per vedere risultati?',
            a: 'Con costanza e impegno, i primi risultati sono visibili già dopo 4-6 settimane. Ogni percorso è diverso e dipende dal punto di partenza e dagli obiettivi.',
          },
          {
            q: 'Posso cambiare piano durante il percorso?',
            a: 'Certamente! Il tuo piano può essere adattato in base ai progressi e alle tue esigenze.',
          },
        ]}
      />
    </Box>
  );
}
