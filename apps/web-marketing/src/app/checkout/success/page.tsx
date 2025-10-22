import { Box, Container, Heading, Text, VStack, Button } from '@chakra-ui/react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pagamento Completato | Petra Online Coaching',
  description: 'Il tuo pagamento è stato completato con successo',
};

export default function CheckoutSuccessPage() {
  return (
    <Box pt={20} minH="100vh" bg="surface.page">
      <Container maxW="container.md" px={[4, 6, 8]} py={[16, 20, 24]}>
        <VStack gap={8} textAlign="center">
          <Box fontSize="6xl">🎉</Box>
          
          <Heading as="h1" textStyle="h2" color="heading.onPage">
            Pagamento Completato!
          </Heading>

          <Text fontSize="lg" color="text.onPage">
            Grazie per aver scelto Petra Online Coaching!
          </Text>

          <Box
            w="full"
            bg="status.successLight"
            p={6}
            borderRadius="lg"
            border="1px solid"
            borderColor="status.success"
          >
            <VStack gap={4} align="flex-start">
              <Text fontWeight="semibold" color="status.success">
                ✓ Pagamento confermato
              </Text>
              <Text fontSize="sm" color="text.onPage">
                Riceverai a breve un'email di conferma con:
              </Text>
              <VStack as="ul" align="flex-start" gap={2} pl={6} listStyleType="disc" w="full">
                <Text as="li" fontSize="sm" color="text.onPage">
                  Link per accedere all'app
                </Text>
                <Text as="li" fontSize="sm" color="text.onPage">
                  Istruzioni per la tua prima consulenza video
                </Text>
                <Text as="li" fontSize="sm" color="text.onPage">
                  Credenziali di accesso
                </Text>
                <Text as="li" fontSize="sm" color="text.onPage">
                  Ricevuta del pagamento
                </Text>
              </VStack>
            </VStack>
          </Box>

          <Box w="full" bg="neutralLight.default" p={6} borderRadius="lg">
            <VStack gap={4}>
              <Text fontWeight="semibold" color="text.primary">
                🚀 Prossimi Passi
              </Text>
              <VStack as="ol" align="flex-start" gap={3} pl={6} listStyleType="decimal" w="full">
                <Text as="li" fontSize="sm" color="text.onPage">
                  Controlla la tua email (anche nello spam)
                </Text>
                <Text as="li" fontSize="sm" color="text.onPage">
                  Scarica l'app CoachPlus
                </Text>
                <Text as="li" fontSize="sm" color="text.onPage">
                  Prenota la tua consulenza iniziale
                </Text>
                <Text as="li" fontSize="sm" color="text.onPage">
                  Inizia il tuo percorso di trasformazione!
                </Text>
              </VStack>
            </VStack>
          </Box>

          <Text fontSize="sm" color="text.muted">
            Hai domande? Contattami via WhatsApp o email, trovi i contatti nella tua email di
            benvenuto.
          </Text>

          <Button asChild size="lg">
            <Link href="/">Torna alla Home</Link>
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}

