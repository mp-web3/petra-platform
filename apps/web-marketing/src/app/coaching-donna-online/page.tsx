'use client';

import { Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import {
  Hero,
  SectionWithImageAndText,
  Steps,
  SubscriptionPlanSection,
  BenefitsSection,
  AppAccessSection,
  FAQsSection,
  TripleAccordion,
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
        backgroundImage="/images/coaching-online-woman-training-park.webp"
        titleLine1="coaching donna"
        titleLine2="online"
        buttonText="inizia ora"
        buttonOnClick={scrollToSubscriptionPlanSection}
        objectionReducingInfoText="Insieme costruiamo il tuo percorso: coaching individuale e sostegno continuo da donna a donna per il cambiamento che hai sempre desiderato."
      />

      <SectionWithImageAndText
        heading="il mio programma fa per te?"
        imageUrl="/images/coach-squat-close-up.webp"
        imageAlt="Giovane donna coaching online"
        text={`Sogni di iniziare ad allenarti ma non sai come muovere i primi passi?
Ti senti persa quando varchi la soglia della palestra? Ti alleni da tempo senza vedere i risultati che desideri?
Cerchi un programma specificamente pensato per il corpo e le esigenze femminili? Vuoi spingerti oltre i tuoi limiti e scoprire di cosa sei davvero capace? Vuoi rimetterti in forma e sentirti bene con te stessa?
Se ti riconosci in almeno una di queste domande, sei nel posto giusto.
Il mio coaching è nato proprio per rispondere a questi bisogni, per offrirti la guida e il supporto che hai sempre cercato. Non importa da dove parti o quali sono i tuoi obiettivi: insieme troveremo la strada giusta per te.`}
      />

      {/* Accordion */}
      <TripleAccordion
        items={[
          {
            title: 'valorizzazione forme femminili',
            text: `Percorso mirato a valorizzare le forme femminili, puntando a un rimodellamento armonico del corpo, con focus specifico su glutei, schiena e addome per creare quella "V-shape" tanto desiderata. 
                                Un approccio "su misura" che combina sviluppo muscolare mirato e tonificazione total body per esaltare la naturale bellezza del corpo femminile.`,
          },
          {
            title: 'sviluppo forza',
            text: `persorso mirato allo sviluppo della forza: siamo donne, siamo forti! Un cammino per le donne coraggiose, pronte a fidarsi del proprio corpo e scoprire tutte le sue potenzialità. 
                                Un percorso che sfida i "limiti" autoimposti e rivela la vera forza che è in ogni donna.`,
          },
          {
            title: 'fitness',
            text: `percorso dedicato a ritrovare la forma fisica e benessere generale. 
                                Un programma completo per chi si sente "fuori forma" e vuole riconquistare tonicità, energia e consapevolezza del proprio corpo.`,
          },
        ]}

      />

      <Steps
        heading="Passo a passo la tua trasformazione assieme a me"
        items={[
          {
            number: 1,
            title: 'STEP 1',
            subtitle: 'Consulenza video iniziale',
            bullets: [
              'Ti ascolterò per conoscere la tua storia e le tue esperienze passate con fitness e sport',
              'Analizzeremo insieme il tuo punto di partenza attuale, esploreremo i tuoi obiettivi e le tue aspettative',
              'Definiremo il percorso più adatto a te, valutando impegno e motivazione',
            ],
          },
          {
            number: 2,
            title: 'STEP 2',
            subtitle: 'Il tuo primo piano personalizzato',
            bullets: [
              'Creerò un programma di allenamento pensato esclusivamente per te',
              "Riceverai l'accesso alla tua App personale entro 5 giorni lavorativi",
              'Troverai la prima scheda di 6 settimane con video dimostrativi per ogni esercizio',
            ],
          },
          {
            number: 3,
            title: 'STEP 3',
            subtitle: 'Feedback e monitoraggio costante',
            bullets: [
              'Potrai contattarmi via WhatsApp per qualsiasi dubbio o domanda',
              'Potrai inviarmi video esecuzioni degli esercizi per ricevere feedback immediati sulla tecnica',
              'Ogni 5 settimane faremo una consulenza video (inclusa nel pacchetto)',
              'Insieme faremo il punto sui progressi e pianificheremo i passi successivi',
            ],
          },
        ]}
      />

      <AppAccessSection
        heading="accesso all'app"
        features={[
          {
            featureIconSrc: '/icons/video_library_primary.svg',
            featureIconAlt: 'Video tutorial',
            featureTitle: 'Video Tutorial Dettagliati',
            featureText: 'Sequenze di esercizi dettagliate con serie, ripetizioni, tempi di recupero e note tecniche di esecuzione',
          },
          {
            featureIconSrc: '/icons/calendar_month_primary.svg',
            featureIconAlt: 'Calendario',
            featureTitle: 'Piani di Allenamento Personalizzati',
            featureText: 'Accesso a piani di allenamento di sei settimane completamente personalizzati per i tuoi obiettivi',
          },
          {
            featureIconSrc: '/icons/edit_note_primary.svg',
            featureIconAlt: 'Feedback',
            featureTitle: 'Feedback Post-Allenamento',
            featureText: 'Possibilità di fornire feedback dopo ogni allenamento per monitorare progressi e adattamenti',
          },
          {
            featureIconSrc: '/icons/format_list_numbered_primary.svg',
            featureIconAlt: 'Video istruttivi',
            featureTitle: 'Video Istruttivi',
            featureText: 'Video esplicativi per ogni esercizio con dimostrazioni tecniche complete',
          },
        ]}
        mockupImageSrc="/images/coachplus-iphone-mockup.png"
        mockupImageAlt="iphone displaying open app coach plus"
      />

      <Box id="piani" ref={subscriptionPlanSectionRef}>
        <SubscriptionPlanSection
          header="Scegli il piano"
          subHeader="Trova il percorso più adatto a te. Ogni piano include supporto personalizzato e accesso completo alla piattaforma."
          plans={plansWomanPremium.map((plan) => ({
            title: plan.title,
            subtitle: plan.subtitle,
            priceLabel: plan.priceLabel,
            ctaText: 'scegli',
            highlighted: plan.highlighted,
            features: plan.features,
            ctaHref: toPreviewHref(plan.slug),
          }))}
        />
      </Box>

      <BenefitsSection
        heading="Perché scegliere"
        highlight="Premium"
        items={[
          {
            iconSrc: '/icons/chat_primary.svg',
            iconAlt: 'Comunicazione',
            title: 'Comunicazione Continua',
            description: 'Contatto diretto con me per chiarire dubbi, risolvere problemi e mantenere alta la motivazione lungo tutto il percorso',
          },
          {
            iconSrc: '/icons/videocam_primary.svg',
            iconAlt: 'Correzioni video',
            title: 'Correzioni Video',
            description: ' Inviami i tuoi esercizi per ricevere feedback personalizzati e migliorare la tua tecnica',
          },
          {
            iconSrc: '/icons/star_border_primary.svg',
            iconAlt: 'Supporto',
            title: 'Supporto Professionale',
            description: 'Percorso flessibile con guida continua, programmazione su misura e assistenza dedicata',
          },
        ]}
        showCta
        ctaText="Inizia il tuo percorso premium"
        onCtaClick={scrollToSubscriptionPlanSection}
      />

      <FAQsSection
        heading="DOMANDE"
        highlight="FREQUENTI"
        subheading="Trova risposta ai tuoi dubbi sul coaching online personalizzato"
        items={[
          {
            q: 'Cosa succede dopo l\'acquisto del percorso?',
            a: `Dopo l'acquisto riceverai una mail con tutte le istruzioni per prenotare la consulenza iniziale, che si svolgerà in videochiamata su Google Meet.
Dopo la consulenza riceverai le indicazioni per scaricare l'app e registrarti come mio/a atleta.
Entro 5 giorni lavorativi dalla consulenza, riceverai via email la conferma di inizio percorso e troverai il tuo programma personalizzato caricato sull'app (con data di inizio fissata al lunedì della settimana successiva).`,
          },
          { q: 'Come posso effettuare il pagamento?', a: 'Puoi pagare con carta di credito/debito, PayPal, bonifico istantaneo o altri metodi disponibili nella pagina di checkout.' },
          {
            q: 'Come posso rinnovare il percorso?',
            a: `Il lunedì dell'ultima 5ª settimana riceverai una mail di follow-up per rinnovare con anticipo il percorso.
In questo modo potrai prenotare subito la consulenza di monitoraggio ed evitare interruzioni tra un programma di allenamento e l'altro.
Sono previsti sconti per rinnovo o upgrade (consulta la pagina dedicata).`,
          },
          { q: "Come prenoto la consulenza iniziale?", a: "Dopo l'acquisto riceverai via mail gli slot disponibili: potrai scegliere in autonomia giorno e orario tra quelli proposti. La consulenza si svolgerà online tramite Google Meet." },
          { q: "In cosa consiste la consulenza iniziale?", a: "È una videochiamata (di massimo 60 minuti) in cui analizzeremo insieme il tuo livello attuale, eventuali esperienze passate, lo stile di vita, la motivazione e gli obiettivi. Questo mi permette di costruire un percorso completamente personalizzato su di te." },
          { q: "Quando riceverò il programma personalizzato?", a: "Il programma verrà caricato sull'app entro 5 giorni lavorativi dalla consulenza. La data di inizio percorso è sempre fissata al lunedì della settimana successiva alla consegna." },
          { q: "Come riceverò il programma personalizzato?", a: "Lo troverai direttamente sull'app, insieme a tutte le note per iniziare." },
          { q: "Dove posso scaricare l'app?", a: "L'app è disponibile per dispositivi iOS e Android. Riceverai il link per il download e le istruzioni per completare la registrazione come mio/a atleta dopo la consulenza iniziale." },
          { q: "Il programma di allenamento è personalizzato?", a: "Sì, ogni programma è creato su misura in base a obiettivi, livello di partenza, disponibilità settimanale e stile di vita." },
          { q: "Il percorso è adatto anche ai principianti?", a: "Assolutamente sì! È pensato anche per chi parte da zero. Per chi ha poca esperienza è consigliato il percorso Premium con supporto costante e correzione video. È anche possibile affiancare sessioni di personal training 1:1 in presenza." },
          { q: "Ci sono video dimostrativi degli esercizi sull'app?", a: "Sì, ogni esercizio è accompagnato da un video tutorial chiaro e dettagliato, più eventuali note per l'esecuzione corretta." },
          { q: "Quanti allenamenti a settimana sono previsti?", a: "La frequenza è definita in base ai tuoi obiettivi e al tempo a disposizione. La decidiamo insieme durante la consulenza iniziale." },
          { q: "Quanto dura un programma di allenamento personalizzato?", a: "Dipende dal percorso scelto: 6 settimane (~1,5 mesi), 18 settimane (~4,5 mesi), 36 settimane (~9 mesi)." },
          { q: "Posso contattarti se ho dubbi durante il percorso?", a: "Sì, in base alle modalità del percorso scelto.\nPercorso Starter: comunicazione via email solo per urgenze.\nPercorso Premium: supporto via email + WhatsApp, con invio video per correzione tecnica e assistenza continua." },
          { q: "Vorrei fare delle lezioni in presenza: è possibile?", a: "Sì, possiamo organizzare lezioni di personal training 1:1 dal vivo in base alla tua zona e alla mia disponibilità." },
          { q: "Ti ho scritto su Instagram ma non ho ricevuto risposta. Perché?", a: "Instagram non è un canale ufficiale di assistenza. Per il coaching online rispondo solo tramite i canali previsti dal percorso (email e/o WhatsApp a seconda del piano)." },
          { q: "Quali sono gli sconti attivabili?", a: "Durante l'anno posso attivare promozioni stagionali o sconti per chi rinnova. Tieni d'occhio la pagina offerte o iscriviti alla newsletter." },
          { q: "Come funzionano i codici sconto?", a: "Inserisci il codice al checkout: lo sconto viene applicato automaticamente." },
          { q: "È possibile sospendere momentaneamente il percorso?", a: "Possibile solo per percorsi da 18 o 36 settimane e per motivi di salute certificati. La durata di sospensione viene concordata in base alle necessità." },
          { q: "Come richiedo la sospensione del percorso?", a: "Invia una richiesta via email allegando il certificato medico. Valuterò il caso e ti risponderò con i dettagli." },
          { q: "Cosa succede se vado in vacanza durante il percorso?", a: "Il coaching è flessibile: possiamo inserire settimane di scarico o allenamenti alternativi. Non è prevista la sospensione per motivi personali o vacanze." },
          { q: "Riceverò una ricevuta o una fattura?", a: "Sì, riceverai regolare ricevuta/fattura via email all'acquisto." },
          { q: "Hai altre domande?", a: "Scrivimi via email: sarò felice di aiutarti!" },
        ]}
      />
    </Box>
  );
}

