'use client';

import { useSearchParams } from 'next/navigation';
import { Box, Container, Heading, Text, VStack, Button, HStack, Checkbox, Field, Input, Stack } from '@chakra-ui/react';
import { useEffect, useState, Suspense } from 'react';
import { getPlanBySlug } from '@/lib/plans';
import type { UiPlan } from '@/lib/plans';
import { createApiClient } from '@petra/api-client';
import Link from 'next/link';
import { TermsOfServiceDialog } from '@/components';
import { HCaptchaWidget } from '@/components/HCaptcha';

function PreviewOrderContent() {
  const searchParams = useSearchParams();
  const planSlug = searchParams.get('plan');
  const [plan, setPlan] = useState<UiPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptedTos, setAcceptedTos] = useState(false);
  const [termsVersion, setTermsVersion] = useState<string | null>(null);
  const [privacyVersion, setPrivacyVersion] = useState<string | null>(null)
  const [email, setEmail] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [showTosHelp, setShowTosHelp] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);

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

  const validateEmail = (email: string) => {
    if (!email) return 'Email richiesta';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Email non valida';
    return null;
  };

  const handleCheckout = async () => {
    if (!plan) return;

    // Validate email
    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    if (!acceptedTos) {
      setError('Devi accettare i termini di servizio per procedere');
      return;
    }

    if (!captchaToken) {
      setError('Completa la verifica CAPTCHA per procedere');
      return;
    }

    setLoading(true);
    setError(null);
    setEmailError(null);

    try {
      let currentPrivacyVersion = privacyVersion;
      if (!currentPrivacyVersion) {
        const { CURRENT_PRIVACY_VERSION } = await import('@/lib/legal');
        currentPrivacyVersion = CURRENT_PRIVACY_VERSION
        setPrivacyVersion(currentPrivacyVersion)
      }

      const apiClient = createApiClient(
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      );

      const result = await apiClient.checkout.createCheckoutSession({
        planId: plan.slug,
        email,
        acceptedTos,
        disclosureTosVersion: termsVersion || 'v1.0',
        acceptedPrivacy: true,
        disclosurePrivacyVersion: privacyVersion || 'v1.0',
        marketingOptIn,
        'h-captcha-response': captchaToken! // Non-null assertion: validated above
      });

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);

      // Extract error message for better user feedback
      let errorMessage = 'Si è verificato un errore. Riprova più tardi.';
      if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setCaptchaToken(null); // Reset CAPTCHA on error so user can try again
      setLoading(false);
    }
  };

  if (!planSlug) {
    return (
      <Box pt={20} minH="100vh" bg="surface.page">
        <Container maxW="container.md" px={[4, 6, 8]} pb={[16, 20, 24]}>
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
        <Container maxW="container.md" px={[4, 6, 8]} pb={[16, 20, 24]}>
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
        <Container maxW="container.md" px={[4, 6, 8]} pb={[16, 20, 24]}>
          <Text textAlign="center">Caricamento...</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box pt={20} minH="100vh" bg="surface.page">
      <Container maxW="container.md" px={[4, 6, 8]} pb={[16, 20, 24]} >
        <VStack align="flex-start" gap={8}>
          <Heading as="h1" textStyle="h2">
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
                  {plan.features
                    .filter((feature) => feature.checked ?? true)
                    .map((feature) => (
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
            p={6}
            borderRadius="md"
            border="1px solid"
            borderColor="border.subtle"
          >
            <VStack align="flex-start" gap={4}>
              <Text fontSize="sm" fontWeight="semibold" color="text.onPage">
                📋 Consensi e Conferma
              </Text>
              <Text fontSize="sm" color="text.onPage">
                Prima di procedere al pagamento, devi leggere e accettare i termini di
                servizio.
              </Text>

              <TermsOfServiceDialog
                checked={acceptedTos}
                onChange={(next, version) => {
                  setAcceptedTos(next);
                  if (next) {
                    setTermsVersion(version);
                    setShowTosHelp(false);
                  }
                }}
                onAccept={(version) => {
                  setAcceptedTos(true);
                  setTermsVersion(version);
                  setShowTosHelp(false);
                }}
              />

              <Stack w="full" gap={4}>
                <Field.Root required>
                  <Checkbox.Root
                    checked={acceptedTos}
                    onCheckedChange={(e) => {
                      const next = e.checked === true;
                      if (next) {
                        // User tried to check without using dialog
                        setShowTosHelp(true);
                      } else {
                        // Allow unchecking
                        setAcceptedTos(false);
                        setShowTosHelp(false);
                      }
                    }}
                    aria-describedby={showTosHelp ? "tos-help" : undefined}
                  >
                    <Checkbox.Control />
                    <Checkbox.Label>Accetto i Termini</Checkbox.Label>
                    <Checkbox.HiddenInput />
                  </Checkbox.Root>
                  {showTosHelp && (
                    <Text id="tos-help" color="text.muted" fontSize="sm">
                      Per attivare questo consenso, clicca "Apri i termini di servizio" e
                      accetta nel riquadro dedicato.
                    </Text>
                  )}
                </Field.Root>

                <Checkbox.Root
                  checked={marketingOptIn}
                  onCheckedChange={(e) => setMarketingOptIn(e.checked === true)}
                  disabled={loading}
                >
                  <Checkbox.Control />
                  <Checkbox.Label>Marketing (opzionale)</Checkbox.Label>
                  <Checkbox.HiddenInput />
                </Checkbox.Root>

                <Field.Root required invalid={!!emailError}>
                  <Field.Label>Email</Field.Label>
                  <Input
                    placeholder="petra@gmail.com"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    aria-invalid={!!emailError}
                    autoComplete="email"
                    disabled={loading}
                  />
                  {emailError && <Field.ErrorText>{emailError}</Field.ErrorText>}
                </Field.Root>
              </Stack>

              <Text fontSize="sm" color="text.muted">
                Consulta anche la nostra{' '}
                <Link href="/privacy-policy" style={{ textDecoration: 'underline' }}>
                  Privacy Policy
                </Link>
                .
              </Text>
              <Text fontSize="sm" color="text.onPage">
                Il pagamento è sicuro e gestito da Stripe. Dopo il pagamento, riceverai una
                mail con le istruzioni per i next steps e il link per prenotare la prima
                coaching call.
              </Text>
            </VStack>
          </Box>

          {/* Add CAPTCHA widget here */}
          <Box
            w="full"
            bg="neutralLight.default"
            p={4}
            borderRadius="md"
            border="1px solid"
            borderColor={captchaError ? "status.error" : "border.subtle"}
          >
            <VStack align="flex-start" gap={2}>
              <Text fontSize="sm" fontWeight="semibold" color="text.onPage">
                Verifica di sicurezza
              </Text>
              <Text fontSize="xs" color="text.muted">
                Completa la verifica per procedere con il pagamento
              </Text>
              <HCaptchaWidget
                onVerify={(token) => {
                  setCaptchaToken(token);
                  setCaptchaError(null);
                }}
                onError={() => {
                  setCaptchaToken(null);
                  setCaptchaError('Verifica CAPTCHA fallita. Riprova.');
                }}
              />
              {captchaError && (
                <Text fontSize="sm" color="status.error">
                  {captchaError}
                </Text>
              )}
            </VStack>
          </Box>

          <HStack gap={4} w="full">
            <Button asChild variant="outline" flex={1}>
              <Link href="/coaching-donna-online#piani">Cambia Piano</Link>
            </Button>
            <Button
              onClick={handleCheckout}
              loading={loading}
              disabled={!acceptedTos || !email || !captchaToken || loading}
              bg="surface.action"
              color="text.onSurfaceAction"
              _hover={{ bg: 'interactive.primaryHover' }}
              flex={1}
            >
              {loading ? 'Reindirizzamento...' : 'Procedi al Pagamento'}
            </Button>
          </HStack>

          <Text fontSize="xs" color="text.muted" textAlign="center" w="full">
            🔒 Pagamento sicuro tramite Stripe
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}

export default function PreviewOrderPage() {
  return (
    <Suspense fallback={
      <Box pt={20} minH="100vh" bg="surface.page">
        <Container maxW="container.md" px={[4, 6, 8]} pb={[16, 20, 24]}>
          <Text textAlign="center">Caricamento...</Text>
        </Container>
      </Box>
    }>
      <PreviewOrderContent />
    </Suspense>
  );
}

