'use client';

import { useSearchParams } from 'next/navigation';
import { Box, Container, Heading, Text, VStack, Button, HStack } from '@petra/ui';
import { useEffect, useState } from 'react';
import { getPlanBySlug } from '@/lib/plans';
import type { UiPlan } from '@/lib/plans';
import { createApiClient } from '@petra/api-client';
import Link from 'next/link';

export default function PreviewOrderPage() {
  const searchParams = useSearchParams();
  const planSlug = searchParams.get('plan');
  const [plan, setPlan] = useState<UiPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (planSlug) {
      const foundPlan = getPlanBySlug(planSlug);
      if (foundPlan) {
        setPlan(foundPlan);
      } else {
        setError('Piano non trovato');
      }
    }
  }, [planSlug]);

  const handleCheckout = async () => {
    if (!plan) return;

    setLoading(true);
    setError(null);

    try {
      const apiClient = createApiClient(
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      );

      const result = await apiClient.checkout.createCheckoutSession({
        planId: plan.slug,
        email: '', // Will be filled in Stripe checkout
        acceptedTos: true,
        disclosureVersion: 'v1.0',
        marketingOptIn: false,
      });

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Si è verificato un errore. Riprova più tardi.');
      setLoading(false);
    }
  };

  if (!planSlug) {
    return (
      <Box pt={20} minH="100vh" bg="surface.page">
        <Container maxW="container.md" px={[4, 6, 8]} py={[16, 20, 24]}>
          <VStack gap={6} textAlign="center">
            <Heading as="h1" textStyle="h2" color="heading.onPage">
              Nessun Piano Selezionato
            </Heading>
            <Text color="text.onPage">
              Seleziona un piano dalla pagina dei piani per procedere.
            </Text>
            <Button asChild>
              <Link href="/coaching-donna-online#piani">Scegli un Piano</Link>
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error && !plan) {
    return (
      <Box pt={20} minH="100vh" bg="surface.page">
        <Container maxW="container.md" px={[4, 6, 8]} py={[16, 20, 24]}>
          <VStack gap={6} textAlign="center">
            <Heading as="h1" textStyle="h2" color="heading.onPage">
              Piano Non Trovato
            </Heading>
            <Text color="text.onPage">{error}</Text>
            <Button asChild>
              <Link href="/coaching-donna-online#piani">Torna ai Piani</Link>
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (!plan) {
    return (
      <Box pt={20} minH="100vh" bg="surface.page">
        <Container maxW="container.md" px={[4, 6, 8]} py={[16, 20, 24]}>
          <Text textAlign="center">Caricamento...</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box pt={20} minH="100vh" bg="surface.page">
      <Container maxW="container.md" px={[4, 6, 8]} py={[16, 20, 24]}>
        <VStack align="flex-start" gap={8}>
          <Heading as="h1" textStyle="h2" color="heading.onPage">
            Riepilogo Ordine
          </Heading>

          <Box
            w="full"
            bg="neutralLight.default"
            p={6}
            borderRadius="lg"
            border="1px solid"
            borderColor="border.subtle"
          >
            <VStack align="flex-start" gap={4}>
              <Heading as="h2" size="xl" color="heading.onPage">
                {plan.title}
              </Heading>
              {plan.subtitle && (
                <Text fontSize="lg" color="text.muted">
                  {plan.subtitle}
                </Text>
              )}

              <Box pt={4} borderTop="1px solid" borderColor="border.subtle" w="full">
                <HStack justify="space-between" w="full">
                  <Text fontSize="lg" fontWeight="semibold">
                    Totale:
                  </Text>
                  <Heading as="p" size="2xl" color="primary.default">
                    {plan.priceLabel}
                  </Heading>
                </HStack>
              </Box>

              <Box pt={2}>
                <Text fontSize="sm" color="text.muted" mb={2}>
                  Include:
                </Text>
                <VStack as="ul" align="flex-start" gap={2} pl={4} listStyleType="disc">
                  {plan.features.map((feature) => (
                    <Text as="li" key={feature.id} fontSize="sm" color="text.onPage">
                      {feature.label}
                    </Text>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </Box>

          {error && (
            <Box
              w="full"
              bg="status.errorLight"
              p={4}
              borderRadius="md"
              border="1px solid"
              borderColor="status.error"
            >
              <Text color="status.error">{error}</Text>
            </Box>
          )}

          <Box
            w="full"
            bg="neutralLight.light"
            p={4}
            borderRadius="md"
            border="1px solid"
            borderColor="border.subtle"
          >
            <VStack align="flex-start" gap={2}>
              <Text fontSize="sm" fontWeight="semibold" color="text.onPage">
                📋 Nota Importante
              </Text>
              <Text fontSize="sm" color="text.onPage">
                Procedendo con l'acquisto, accetti i nostri{' '}
                <Link href="/terms" style={{ textDecoration: 'underline' }}>
                  Termini e Condizioni
                </Link>{' '}
                e la{' '}
                <Link href="/privacy-policy" style={{ textDecoration: 'underline' }}>
                  Privacy Policy
                </Link>
                .
              </Text>
              <Text fontSize="sm" color="text.onPage">
                Il pagamento è sicuro e gestito da Stripe. Dopo il pagamento, riceverai
                immediatamente accesso alla piattaforma e alle tue prime istruzioni via email.
              </Text>
            </VStack>
          </Box>

          <HStack gap={4} w="full">
            <Button asChild variant="outline" flex={1}>
              <Link href="/coaching-donna-online#piani">Cambia Piano</Link>
            </Button>
            <Button
              onClick={handleCheckout}
              loading={loading}
              bg="surface.action"
              color="text.onSurfaceAction"
              _hover={{ bg: 'interactive.primaryHover' }}
              flex={1}
            >
              {loading ? 'Reindirizzamento...' : 'Procedi al Pagamento'}
            </Button>
          </HStack>

          <Text fontSize="xs" color="text.muted" textAlign="center" w="full">
            🔒 Pagamento sicuro tramite Stripe • Garanzia soddisfatti o rimborsati entro 14
            giorni
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}

