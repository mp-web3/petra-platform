import { Box, Container, Heading, Text, VStack, Button, HStack } from '@chakra-ui/react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pagamento Annullato | Petra Online Coaching',
  description: 'Il pagamento è stato annullato',
};

export default function CheckoutCancelPage() {
  return (
    <Box pt={20} minH="100vh" bg="surface.page">
      <Container maxW="container.md" px={[4, 6, 8]} py={[16, 20, 24]}>
        <VStack gap={8} textAlign="center">
          <Box fontSize="6xl">😔</Box>

          <Heading as="h1" textStyle="h2" color="heading.onPage">
            Pagamento Annullato
          </Heading>

          <Text fontSize="lg" color="text.onPage">
            Il processo di pagamento è stato annullato.
          </Text>

          <Box w="full" bg="status.warningLight" p={6} borderRadius="lg">
            <VStack gap={4}>
              <Text fontWeight="semibold" color="text.onPage">
                ℹ️ Cosa è successo?
              </Text>
              <Text fontSize="sm" color="text.onPage">
                Hai annullato il pagamento o si è verificato un problema durante la procedura.
                Nessun addebito è stato effettuato.
              </Text>
            </VStack>
          </Box>

          <Box w="full" bg="neutralLight.default" p={6} borderRadius="lg">
            <VStack gap={4}>
              <Text fontWeight="semibold" color="text.primary">
                💡 Cosa puoi fare
              </Text>
              <VStack as="ul" align="flex-start" gap={2} pl={6} listStyleType="disc" w="full">
                <Text as="li" fontSize="sm" color="text.onPage">
                  Riprova il pagamento quando sei pronto
                </Text>
                <Text as="li" fontSize="sm" color="text.onPage">
                  Scegli un piano diverso se preferisci
                </Text>
                <Text as="li" fontSize="sm" color="text.onPage">
                  Contattami per qualsiasi domanda o dubbio
                </Text>
                <Text as="li" fontSize="sm" color="text.onPage">
                  Esplora ancora il sito per saperne di più
                </Text>
              </VStack>
            </VStack>
          </Box>

          <HStack gap={4}>
            <Button asChild variant="outline">
              <Link href="/">Torna alla Home</Link>
            </Button>
            <Button asChild>
              <Link href="/coaching-donna-online#piani">Riprova</Link>
            </Button>
          </HStack>

          <Text fontSize="sm" color="text.muted">
            Hai bisogno di aiuto? Contattami via WhatsApp o email per assistenza.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}

