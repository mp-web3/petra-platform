'use client';

import { Box, SimpleGrid, Container, Heading, VStack, Text, Image as ChakraImage } from '@chakra-ui/react';
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
        backgroundImage="/images/fitness-coach-online-deadlift.webp"
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
          backgroundImage="url(/images/fitness-coach-barbell-row.webp)"
          backgroundSize="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          zIndex={1}
        />

        {/* Dark Overlay */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="hoverlay.default"
          zIndex={2}
        />

        {/* Content */}
        <Container
          position="relative"
          zIndex={3}
          maxW="container.xl"
          px={[4, 6, 8]}
          py={[16, 20, 24]}
          h="auto"
          display="flex"
          alignItems="center"
        >
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            gap={[11, 6, 8]}
            mx="auto"
            alignItems="stretch"
            justifyItems="flex-start"
            w="100%"
          >
            <VStack align="flex-start" gap={[4, 4, 8]}>
              <Heading
                as="h2"
                textStyle="h2"
                color="text.onDefaultHoverlay"
                whiteSpace="pre-line"
                lineHeight={1}
              >
                il metodo
              </Heading>
              <Text
                textStyle="md"
                color="text.onDefaultHoverlay"
                textAlign="left"
                whiteSpace="pre-line"
              >
                {`Credo che un coaching efficace nasca da un legame autentico tra coach e atleta. Non si tratta solo di allenamenti e risultati, ma di fiducia, comunicazione e condivisione.
Il coaching non è solo una scheda da seguire, ma un percorso personalizzato che tiene conto delle tue esigenze, dei tuoi ritmi e delle tue aspirazioni.
Per me, l'obiettivo è costruire insieme un cambiamento duraturo, porsi nuove sfide, impegnarsi con passione e, soprattutto, divertirsi lungo il percorso.`}
              </Text>
            </VStack>

            <ChakraImage
              src="/images/fitness-coach-barbell-row-vertical.webp"
              alt="Fitness strength performance"
              aspectRatio="1/1"
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Personal Training */}
      <PersonalTrainingSection
        heading="PERSONAL TRAINING"
        highlight="1:1 IN PRESENZA"
        subheading="Vuoi portare il tuo allenamento al livello successivo?"
        features={[
          {
            iconSrc: '/icons/video_library_primary.svg',
            iconAlt: 'Attenzione personalizzata',
            title: 'Attenzione Personalizzata',
            description:
              'Allenamenti one‑to‑one dove ogni sessione è studiata esclusivamente per te e i tuoi obiettivi specifici.',
            variant: 'light',
            align: 'center',
            rounded: 'lg',
            hasCardBorder: true,
          },
          {
            iconSrc: '/icons/videocam_primary.svg',
            iconAlt: 'Correzione immediata',
            title: 'Correzione Immediata',
            description:
              'Feedback istantaneo sulla tecnica e progressioni in tempo reale per massimizzare ogni movimento.',
            variant: 'light',
            align: 'center',
            rounded: 'lg',
            hasCardBorder: true,
          },
          {
            iconSrc: '/icons/star_border_primary.svg',
            iconAlt: 'Risultati garantiti',
            title: 'Risultati Garantiti',
            description:
              "L'intensità e la personalizzazione del training 1:1 ti assicurano progressi rapidi e duraturi.",
            variant: 'light',
            align: 'center',
            rounded: 'lg',
            hasCardBorder: true,
          },
        ]}
        ctaText="vai al form"
        ctaHref=""
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
      <Box minH="100vh" position="relative">
        {/* Background Image */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundImage="url(/images/vintage-medicine-balls-background.webp)"
          backgroundSize="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          zIndex={1}
        />

        {/* Dark Overlay */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="hoverlay.default"
          zIndex={2}
        />

        {/* Content */}
        <Container
          position="relative"
          zIndex={3}
          maxW="container.xl"
          px={[4, 6, 8]}
          py={[16, 20, 24]}
          gap={[4, 4, 8]}
          h="100vh"
          display="flex"
          alignItems="center"
          flexDirection="column"
        >
          <Heading as="h4" textStyle="h4" color="heading.onDark" textAlign="center">
            incontra la tua coach
          </Heading>

          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            gap={[11, 6, 8]}
            mx="auto"
            alignItems="stretch"
            justifyItems={['center', 'flex-start']}
            w="100%"
          >
            <VStack align={['center', 'flex-start']} justifySelf="left" gap={[4, 4, 8]}>
              <Heading
                as="h2"
                textStyle="h2"
                color="primary.default"
                whiteSpace="pre-line"
                lineHeight={1}
                textAlign={['center', 'left']}
              >
                {`petra
scaringelli`}
              </Heading>
              {/* Mobile-only image under heading */}
              <ChakraImage
                src="/images/petra-primo-piano.webp"
                aspectRatio="1/1"
                alt="Coach P - Petra Scaringelli"
                objectPosition="center"
                objectFit="cover"
                maxW={['60%', '100%']}
                display={['block', 'none']}
              />
              <Text
                textStyle="md"
                color="text.onDefaultHoverlay"
                textAlign={['center', 'left']}
                whiteSpace="pre-line"
              >
                {`Mi chiamo Petra e il mio primo amore… aveva i guantoni.

Il pugilato agonistico mi ha introdotta al mondo dello sport, insegnandomi disciplina, forza mentale e il coraggio di superare i miei limiti. Dopo questa esperienza, ho continuato il mio percorso in palestra, tra body-building, allenamento funzionale e powerlifting.

Oggi sono una personal trainer e coach online, e propongo percorsi personalizzati con un approccio basato sull'ascolto, la fiducia e il rapporto autentico tra coach e atleta. Perché, per me, l'allenamento è molto più di serie e ripetizioni: è un modo per sentirsi forti, presenti e… nel posto giusto.`}
              </Text>
            </VStack>
            <ChakraImage
              src="/images/petra-primo-piano.webp"
              aspectRatio="1/1"
              alt="Coach P - Petra Scaringelli"
              objectPosition="center"
              objectFit="cover"
              maxW={['50%', '100%']}
              display={['none', 'block']}
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* FAQs */}
      <FAQsSection
                heading="DOMANDE"
                highlight="FREQUENTI"
                subheading="Trova risposta ai tuoi dubbi sul coaching online personalizzato"
                items={[
                    {
                        q: 'Cosa succede dopo l\'acquisto del percorso?',
                        a: `Dopo l’acquisto riceverai una mail con tutte le istruzioni per prenotare la consulenza iniziale, che si svolgerà in videochiamata su Google Meet.
                          Dopo la consulenza riceverai le indicazioni per scaricare l’app e registrarti come mio/a atleta.
                          Entro 5 giorni lavorativi dalla consulenza, riceverai via email la conferma di inizio percorso e troverai il tuo programma personalizzato caricato sull’app (con data di inizio fissata al lunedì della settimana successiva).`
                    },
                    { q: 'Come posso effettuare il pagamento?', a: 'Puoi pagare con carta di credito/debito, PayPal, bonifico istantaneo o altri metodi disponibili nella pagina di checkout.' },
                    { q: 'Come posso rinnovare il percorso?', a: `Il lunedì dell’ultima 5ª settimana riceverai una mail di follow-up per rinnovare con anticipo il percorso.
                          In questo modo potrai prenotare subito la consulenza di monitoraggio ed evitare interruzioni tra un programma di allenamento e l’altro.
                          Sono previsti sconti per rinnovo o upgrade (consulta la pagina dedicata).` },
                    // Consulenza iniziale & Programma
                    { q: 'Come prenoto la consulenza iniziale?', a: 'Dopo l’acquisto riceverai via mail gli slot disponibili: potrai scegliere in autonomia giorno e orario tra quelli proposti. La consulenza si svolgerà online tramite Google Meet.' },
                    { q: 'In cosa consiste la consulenza iniziale?', a: 'È una videochiamata (di massimo 60 minuti) in cui analizzeremo insieme il tuo livello attuale, eventuali esperienze passate, lo stile di vita, la motivazione e gli obiettivi. Questo mi permette di costruire un percorso completamente personalizzato su di te.' },
                    { q: 'Quando riceverò il programma personalizzato?', a: 'Il programma verrà caricato sull’app entro 5 giorni lavorativi dalla consulenza. La data di inizio percorso è sempre fissata al lunedì della settimana successiva alla consegna.' },
                    { q: 'Come riceverò il programma personalizzato?', a: 'Lo troverai direttamente sull’app, insieme a tutte le note per iniziare.' },
                    // App e allenamento
                    { q: 'Dove posso scaricare l\'app?', a: 'L\'app è disponibile per dispositivi iOS e Android. Riceverai il link per il download e le istruzioni per completare la registrazione come mio/a atleta dopo la consulenza iniziale.' },
                    { q: 'Il programma di allenamento è personalizzato?', a: 'Sì, ogni programma è creato su misura in base a obiettivi, livello di partenza, disponibilità settimanale e stile di vita.' },
                    { q: 'Il percorso è adatto anche ai principianti?', a: 'Assolutamente sì! È pensato anche per chi parte da zero. Per chi ha poca esperienza è consigliato il percorso Premium con supporto costante e correzione video. È anche possibile affiancare sessioni di personal training 1:1 in presenza.' },
                    { q: 'Ci sono video dimostrativi degli esercizi sull\'app?', a: 'Sì, ogni esercizio è accompagnato da un video tutorial chiaro e dettagliato, più eventuali note per l’esecuzione corretta.' },
                    { q: 'Quanti allenamenti a settimana sono previsti?', a: 'La frequenza è definita in base ai tuoi obiettivi e al tempo a disposizione. La decidiamo insieme durante la consulenza iniziale.' },
                    { q: 'Quanto dura un programma di allenamento personalizzato?', a: 'Dipende dal percorso scelto: 6 settimane (~1,5 mesi), 18 settimane (~4,5 mesi), 36 settimane (~9 mesi).' },
                    // Supporto & Presenzialità
                    { q: 'Posso contattarti se ho dubbi durante il percorso?', a: `Sì, in base alle modalità del percorso scelto.\nPercorso Starter: comunicazione via email solo per urgenze.\nPercorso Premium: supporto via email + WhatsApp, con invio video per correzione tecnica e assistenza continua.` },
                    { q: 'Vorrei fare delle lezioni in presenza: è possibile?', a: 'Sì, possiamo organizzare lezioni di personal training 1:1 dal vivo in base alla tua zona e alla mia disponibilità.' },
                    { q: 'Ti ho scritto su Instagram ma non ho ricevuto risposta. Perché?', a: 'Instagram non è un canale ufficiale di assistenza. Per il coaching online rispondo solo tramite i canali previsti dal percorso (email e/o WhatsApp a seconda del piano).' },
                    // Pagamenti, sconti e codici
                    { q: 'Quali sono gli sconti attivabili?', a: 'Durante l’anno posso attivare promozioni stagionali o sconti per chi rinnova. Tieni d’occhio la pagina offerte o iscriviti alla newsletter.' },
                    { q: 'Come funzionano i codici sconto?', a: 'Inserisci il codice al checkout: lo sconto viene applicato automaticamente.' },
                    // Varie
                    { q: 'È possibile sospendere momentaneamente il percorso?', a: 'Possibile solo per percorsi da 18 o 36 settimane e per motivi di salute certificati. La durata di sospensione viene concordata in base alle necessità.' },
                    { q: 'Come richiedo la sospensione del percorso?', a: 'Invia una richiesta via email allegando il certificato medico. Valuterò il caso e ti risponderò con i dettagli.' },
                    { q: 'Cosa succede se vado in vacanza durante il percorso?', a: 'Il coaching è flessibile: possiamo inserire settimane di scarico o allenamenti alternativi. Non è prevista la sospensione per motivi personali o vacanze.' },
                    { q: 'Riceverò una ricevuta o una fattura?', a: 'Sì, riceverai regolare ricevuta/fattura via email all’acquisto.' },
                    { q: 'Hai altre domande?', a: 'Scrivimi via email: sarò felice di aiutarti!' },
                ]}
            />
    </Box>
  );
}
