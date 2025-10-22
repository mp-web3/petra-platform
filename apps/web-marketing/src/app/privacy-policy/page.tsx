import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Petra Online Coaching',
  description: 'Informativa sulla privacy e trattamento dei dati personali',
};

export default function PrivacyPolicyPage() {
  return (
    <Box pt={20} bg="surface.page" minH="100vh">
      <Container maxW="container.md" px={[4, 6, 8]} py={[16, 20, 24]}>
        <VStack align="flex-start" gap={8}>
          <Heading as="h1" textStyle="h2" color="heading.onPage">
            Privacy Policy
          </Heading>

          <VStack align="flex-start" gap={6}>
            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                1. Introduzione
              </Heading>
              <Text color="text.onPage">
                Petra Online Coaching rispetta la tua privacy e si impegna a proteggere i tuoi dati
                personali. Questa informativa sulla privacy ti spiega come raccogliamo, utilizziamo
                e proteggiamo le tue informazioni in conformità con il Regolamento Generale sulla
                Protezione dei Dati (GDPR).
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                2. Titolare del Trattamento
              </Heading>
              <Text color="text.onPage">
                Il titolare del trattamento dei dati è Petra Online Coaching. Per qualsiasi
                domanda relativa alla privacy, puoi contattarci attraverso i canali indicati sul
                sito.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                3. Dati Raccolti
              </Heading>
              <Text color="text.onPage" mb={3}>
                Raccogliamo le seguenti categorie di dati:
              </Text>
              <VStack as="ul" align="flex-start" gap={2} pl={6} listStyleType="disc">
                <Text as="li" color="text.onPage">
                  <strong>Dati identificativi:</strong> nome, cognome, email
                </Text>
                <Text as="li" color="text.onPage">
                  <strong>Dati di contatto:</strong> numero di telefono (WhatsApp)
                </Text>
                <Text as="li" color="text.onPage">
                  <strong>Dati di pagamento:</strong> elaborati in modo sicuro tramite Stripe (non
                  conserviamo i dati della carta)
                </Text>
                <Text as="li" color="text.onPage">
                  <strong>Dati di salute e fitness:</strong> informazioni fornite durante le
                  consulenze e nei questionari
                </Text>
                <Text as="li" color="text.onPage">
                  <strong>Dati di utilizzo:</strong> interazioni con l'app e i servizi
                </Text>
              </VStack>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                4. Finalità del Trattamento
              </Heading>
              <Text color="text.onPage" mb={3}>
                Utilizziamo i tuoi dati per:
              </Text>
              <VStack as="ul" align="flex-start" gap={2} pl={6} listStyleType="disc">
                <Text as="li" color="text.onPage">
                  Fornire i servizi di coaching personalizzato
                </Text>
                <Text as="li" color="text.onPage">
                  Comunicare con te via email o WhatsApp
                </Text>
                <Text as="li" color="text.onPage">
                  Elaborare i pagamenti e gestire la fatturazione
                </Text>
                <Text as="li" color="text.onPage">
                  Migliorare i nostri servizi e l'esperienza utente
                </Text>
                <Text as="li" color="text.onPage">
                  Inviarti comunicazioni di marketing (solo con il tuo consenso esplicito)
                </Text>
                <Text as="li" color="text.onPage">
                  Adempiere agli obblighi legali
                </Text>
              </VStack>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                5. Base Giuridica
              </Heading>
              <Text color="text.onPage" mb={3}>
                Trattiamo i tuoi dati sulla base di:
              </Text>
              <VStack as="ul" align="flex-start" gap={2} pl={6} listStyleType="disc">
                <Text as="li" color="text.onPage">
                  <strong>Esecuzione del contratto:</strong> per fornire i servizi richiesti
                </Text>
                <Text as="li" color="text.onPage">
                  <strong>Consenso:</strong> per comunicazioni di marketing e dati sensibili
                </Text>
                <Text as="li" color="text.onPage">
                  <strong>Legittimo interesse:</strong> per migliorare i servizi
                </Text>
                <Text as="li" color="text.onPage">
                  <strong>Obbligo legale:</strong> per adempimenti fiscali e contabili
                </Text>
              </VStack>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                6. Condivisione dei Dati
              </Heading>
              <Text color="text.onPage" mb={3}>
                I tuoi dati possono essere condivisi con:
              </Text>
              <VStack as="ul" align="flex-start" gap={2} pl={6} listStyleType="disc">
                <Text as="li" color="text.onPage">
                  <strong>Stripe:</strong> per l'elaborazione dei pagamenti
                </Text>
                <Text as="li" color="text.onPage">
                  <strong>Fornitori di servizi cloud:</strong> per l'hosting dell'app e dei dati
                </Text>
                <Text as="li" color="text.onPage">
                  <strong>WhatsApp:</strong> per le comunicazioni di supporto
                </Text>
              </VStack>
              <Text color="text.onPage" mt={3}>
                Non vendiamo mai i tuoi dati a terze parti per scopi di marketing.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                7. Conservazione dei Dati
              </Heading>
              <Text color="text.onPage">
                Conserviamo i tuoi dati personali per la durata del rapporto contrattuale e
                successivamente per il periodo necessario a:
              </Text>
              <VStack as="ul" align="flex-start" gap={2} pl={6} listStyleType="disc" mt={2}>
                <Text as="li" color="text.onPage">
                  Adempiere agli obblighi legali (10 anni per dati fiscali)
                </Text>
                <Text as="li" color="text.onPage">
                  Gestire eventuali contenziosi
                </Text>
                <Text as="li" color="text.onPage">
                  Fornire supporto post-servizio
                </Text>
              </VStack>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                8. I Tuoi Diritti
              </Heading>
              <Text color="text.onPage" mb={3}>
                Hai il diritto di:
              </Text>
              <VStack as="ul" align="flex-start" gap={2} pl={6} listStyleType="disc">
                <Text as="li" color="text.onPage">
                  <strong>Accesso:</strong> richiedere una copia dei tuoi dati
                </Text>
                <Text as="li" color="text.onPage">
                  <strong>Rettifica:</strong> correggere dati inesatti o incompleti
                </Text>
                <Text as="li" color="text.onPage">
                  <strong>Cancellazione:</strong> richiedere la cancellazione dei tuoi dati
                </Text>
                <Text as="li" color="text.onPage">
                  <strong>Limitazione:</strong> limitare il trattamento in determinate circostanze
                </Text>
                <Text as="li" color="text.onPage">
                  <strong>Portabilità:</strong> ricevere i tuoi dati in formato strutturato
                </Text>
                <Text as="li" color="text.onPage">
                  <strong>Opposizione:</strong> opporti al trattamento per motivi legittimi
                </Text>
                <Text as="li" color="text.onPage">
                  <strong>Revoca del consenso:</strong> revocare il consenso in qualsiasi momento
                </Text>
              </VStack>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                9. Sicurezza
              </Heading>
              <Text color="text.onPage">
                Implementiamo misure di sicurezza tecniche e organizzative appropriate per
                proteggere i tuoi dati da accessi non autorizzati, perdita o distruzione, inclusi
                crittografia, controlli di accesso e backup regolari.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                10. Cookie
              </Heading>
              <Text color="text.onPage">
                Il nostro sito utilizza cookie tecnici necessari per il funzionamento del sito e
                cookie analitici (solo con il tuo consenso) per migliorare l'esperienza utente.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                11. Modifiche alla Privacy Policy
              </Heading>
              <Text color="text.onPage">
                Ci riserviamo il diritto di aggiornare questa informativa sulla privacy. Le
                modifiche saranno pubblicate su questa pagina con la data di "Ultimo
                aggiornamento" aggiornata.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                12. Contatti
              </Heading>
              <Text color="text.onPage">
                Per esercitare i tuoi diritti o per domande sulla privacy, contattaci via email o
                WhatsApp tramite i riferimenti presenti sul sito.
              </Text>
            </Box>

            <Box pt={6} borderTop="1px solid" borderColor="border.subtle">
              <Text fontSize="sm" color="text.muted">
                Ultimo aggiornamento: Gennaio 2025
              </Text>
              <Text fontSize="sm" color="text.muted">
                Versione: 1.0
              </Text>
            </Box>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}

