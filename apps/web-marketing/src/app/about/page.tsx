import { Box, Container, Heading, Text, VStack } from '@petra/ui';
import { SectionWithImageAndText } from '@/components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Petra Online Coaching',
  description: 'Scopri chi sono e il mio approccio al coaching online personalizzato',
};

export default function AboutPage() {
  return (
    <Box pt={20}>
      <Container maxW="container.xl" px={[4, 6, 8]} py={[16, 20, 24]}>
        <VStack align="flex-start" gap={8} maxW="3xl">
          <Heading as="h1" textStyle="h1" color="heading.onPage">
            Chi Sono
          </Heading>
          <Text fontSize="lg" color="text.onPage">
            Sono Petra, personal trainer certificata con anni di esperienza nel settore del
            fitness e del coaching online. La mia missione è aiutare le persone a raggiungere i
            loro obiettivi attraverso un approccio personalizzato, scientifico e sostenibile.
          </Text>
          <Text fontSize="lg" color="text.onPage">
            Credo fermamente che ogni percorso sia unico: non esistono soluzioni universali quando
            si tratta di fitness e benessere. Per questo motivo, ogni mio programma è creato su
            misura per le esigenze specifiche di chi mi affida il proprio cambiamento.
          </Text>
        </VStack>
      </Container>

      <SectionWithImageAndText
        heading="La Mia Filosofia"
        imageUrl="/images/petra-primo-piano.webp"
        imageAlt="Petra - Personal Trainer"
        text="Il mio metodo si basa su tre pilastri fondamentali: personalizzazione, supporto costante e risultati misurabili. Non credo nelle soluzioni rapide o nei programmi standardizzati. Ogni cliente ha una storia unica, obiettivi specifici e necessita di un approccio su misura. Il mio ruolo è guidarti, motivarti e supportarti in ogni fase del tuo percorso."
      />
    </Box>
  );
}

