import { Box, Container, Heading, Text, VStack } from '@petra/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termini e Condizioni | Petra Online Coaching',
  description: 'Termini e condizioni di utilizzo dei servizi di coaching online',
};

export default function TermsPage() {
  return (
    <Box pt={20} bg="surface.page" minH="100vh">
      <Container maxW="container.md" px={[4, 6, 8]} py={[16, 20, 24]}>
        <VStack align="flex-start" gap={8}>
          <Heading as="h1" textStyle="h2" color="heading.onPage">
            Termini e Condizioni
          </Heading>

          <VStack align="flex-start" gap={6}>
            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                1. Accettazione dei Termini
              </Heading>
              <Text color="text.onPage">
                Utilizzando i servizi di Petra Online Coaching, accetti di essere vincolato da
                questi termini e condizioni. Se non accetti questi termini, ti preghiamo di non
                utilizzare i nostri servizi.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                2. Descrizione del Servizio
              </Heading>
              <Text color="text.onPage">
                Petra Online Coaching offre servizi di coaching personalizzato online, inclusi
                programmi di allenamento, consulenze video, supporto via WhatsApp e accesso a
                un'applicazione dedicata.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                3. Pagamenti e Rimborsi
              </Heading>
              <Text color="text.onPage" mb={3}>
                I pagamenti vengono elaborati tramite Stripe. Tutti i prezzi sono indicati in Euro
                (€) e includono IVA dove applicabile.
              </Text>
              <Text color="text.onPage">
                I rimborsi sono disponibili entro 14 giorni dall'acquisto, in conformità con le
                normative italiane sui diritti dei consumatori, solo se non hai ancora iniziato a
                utilizzare il servizio.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                4. Utilizzo del Servizio
              </Heading>
              <Text color="text.onPage" mb={3}>
                Ti impegni a:
              </Text>
              <VStack as="ul" align="flex-start" gap={2} pl={6} listStyleType="disc">
                <Text as="li" color="text.onPage">
                  Fornire informazioni accurate e complete durante la registrazione
                </Text>
                <Text as="li" color="text.onPage">
                  Utilizzare il servizio solo per scopi legittimi e personali
                </Text>
                <Text as="li" color="text.onPage">
                  Non condividere il tuo accesso con terze parti
                </Text>
                <Text as="li" color="text.onPage">
                  Consultare un medico prima di iniziare qualsiasi programma di allenamento
                </Text>
              </VStack>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                5. Responsabilità
              </Heading>
              <Text color="text.onPage" mb={3}>
                Prima di iniziare qualsiasi programma di allenamento, è fortemente consigliato
                consultare un medico. Petra Online Coaching non è responsabile per eventuali
                lesioni o problemi di salute derivanti dall'utilizzo dei programmi forniti.
              </Text>
              <Text color="text.onPage">
                I risultati possono variare da persona a persona e non sono garantiti.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                6. Proprietà Intellettuale
              </Heading>
              <Text color="text.onPage">
                Tutti i contenuti forniti attraverso i nostri servizi (video, piani di
                allenamento, materiali didattici) sono di proprietà esclusiva di Petra Online
                Coaching e sono protetti da copyright. È vietata la riproduzione o distribuzione
                senza autorizzazione scritta.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                7. Cancellazione e Sospensione
              </Heading>
              <Text color="text.onPage">
                Ci riserviamo il diritto di cancellare o sospendere il tuo accesso ai servizi in
                caso di violazione di questi termini o di comportamento inappropriato.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                8. Modifiche ai Termini
              </Heading>
              <Text color="text.onPage">
                Ci riserviamo il diritto di modificare questi termini in qualsiasi momento.
                Le modifiche saranno pubblicate su questa pagina e la data di "Ultimo
                aggiornamento" sarà aggiornata.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                9. Legge Applicabile
              </Heading>
              <Text color="text.onPage">
                Questi termini sono regolati dalla legge italiana. Qualsiasi controversia sarà di
                competenza esclusiva del foro italiano.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3} color="text.primary">
                10. Contatti
              </Heading>
              <Text color="text.onPage">
                Per domande riguardo a questi termini, contattaci via email o WhatsApp tramite i
                riferimenti presenti sul sito.
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

