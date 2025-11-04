'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Button,
    Input,
} from '@chakra-ui/react';
import Link from 'next/link';
import { createApiClient } from '@petra/api-client';
import { HCaptchaWidget } from '@/components/HCaptcha';

type ActivationState = 'loading' | 'form' | 'success' | 'expired' | 'error';

function ActivateContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email'); // Optional email from query

    const [state, setState] = useState<ActivationState>('loading');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form state
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [captchaError, setCaptchaError] = useState<string | null>(null);

    // Resend activation state
    const [resendEmail, setResendEmail] = useState(email || '');
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCaptchaToken, setResendCaptchaToken] = useState<string | null>(null);
    const [resendSuccess, setResendSuccess] = useState(false);

    useEffect(() => {
        // Check if required params are present
        if (!token || !userId) {
            setState('error');
            setError('Link di attivazione non valido. Mancano token o ID utente.');
            return;
        }
        setState('form');
    }, [token, userId]);

    const validatePassword = (pwd: string): string | null => {
        if (!pwd) return 'Password richiesta';
        if (pwd.length < 8) return 'La password deve essere di almeno 8 caratteri';
        if (!/(?=.*[a-z])/.test(pwd)) return 'La password deve contenere almeno una lettera minuscola';
        if (!/(?=.*[A-Z])/.test(pwd)) return 'La password deve contenere almeno una lettera maiuscola';
        if (!/(?=.*\d)/.test(pwd)) return 'La password deve contenere almeno un numero';
        return null;
    };

    const handleActivate = async () => {
        if (!token || !userId) {
            setError('Link di attivazione non valido');
            return;
        }

        // Validate password
        const pwdError = validatePassword(password);
        if (pwdError) {
            setPasswordError(pwdError);
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError('Le password non corrispondono');
            return;
        }

        if (!captchaToken) {
            setCaptchaError('Completa la verifica CAPTCHA');
            return;
        }

        setLoading(true);
        setError(null);
        setPasswordError(null);
        setCaptchaError(null);

        try {
            const apiClient = createApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
            const result = await apiClient.auth.activateAccount({
                token: token!,
                userId: userId!,
                password,
                name: name || undefined,
                'h-captcha-response': captchaToken,
            });

            setSuccessMessage('Account attivato con successo! Ora puoi accedere.');
            setState('success');
        } catch (err: any) {
            console.error('Activation error:', err);

            const errorMessage = err?.response?.data?.message || err?.message || 'Errore durante l\'attivazione';

            // Check if token expired
            if (errorMessage.includes('expired') || errorMessage.includes('scaduto')) {
                setState('expired');
                setError(null);
            } else {
                setError(errorMessage);
                setState('error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendActivation = async () => {
        if (!resendEmail) {
            setError('Inserisci il tuo indirizzo email');
            return;
        }

        if (!resendCaptchaToken) {
            setCaptchaError('Completa la verifica CAPTCHA');
            return;
        }

        setResendLoading(true);
        setError(null);
        setCaptchaError(null);

        try {
            const apiClient = createApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
            const result = await apiClient.auth.resendActivation({
                email: resendEmail,
                'h-captcha-response': resendCaptchaToken,
            });

            setResendSuccess(true);
            setError(null);
        } catch (err: any) {
            console.error('Resend activation error:', err);
            const errorMessage = err?.response?.data?.message || err?.message || 'Errore durante l\'invio dell\'email';
            setError(errorMessage);
        } finally {
            setResendLoading(false);
        }
    };

    // Loading state
    if (state === 'loading') {
        return (
            <Box pt={20} minH="100vh" bg="surface.page">
                <Container maxW="container.md" px={[4, 6, 8]} py={[16, 20, 24]}>
                    <VStack gap={4} textAlign="center">
                        <Text>Caricamento...</Text>
                    </VStack>
                </Container>
            </Box>
        );
    }

    // Success state
    if (state === 'success') {
        return (
            <Box pt={20} minH="100vh" bg="surface.page">
                <Container maxW="container.md" px={[4, 6, 8]} py={[16, 20, 24]}>
                    <VStack gap={8} textAlign="center">
                        <Box fontSize="6xl">✅</Box>

                        <Heading as="h1" textStyle="h2" color="heading.onPage">
                            Account Attivato!
                        </Heading>

                        <Box
                            w="full"
                            bg="status.successLight"
                            p={6}
                            borderRadius="lg"
                            border="1px solid"
                            borderColor="status.success"
                        >
                            <VStack gap={2} align="flex-start">
                                <Text fontWeight="semibold" color="status.success">
                                    ✓ Attivazione completata
                                </Text>
                                <Text fontSize="sm" color="text.onPage">
                                    {successMessage || 'Il tuo account è stato attivato con successo. Ora puoi accedere.'}
                                </Text>
                            </VStack>
                        </Box>

                        <VStack gap={4} w="full">
                            <Button asChild size="lg" w="full">
                                <Link href="/login">Vai al Login</Link>
                            </Button>
                            <Button asChild variant="outline" w="full">
                                <Link href="/">Torna alla Home</Link>
                            </Button>
                        </VStack>
                    </VStack>
                </Container>
            </Box>
        );
    }

    // Expired token state
    if (state === 'expired') {
        return (
            <Box pt={20} minH="100vh" bg="surface.page">
                <Container maxW="container.md" px={[4, 6, 8]} py={[16, 20, 24]}>
                    <VStack gap={8} textAlign="center">
                        <Box fontSize="6xl">⏰</Box>

                        <Heading as="h1" textStyle="h2" color="heading.onPage">
                            Link di Attivazione Scaduto
                        </Heading>

                        <Box
                            w="full"
                            bg="status.warningLight"
                            p={6}
                            borderRadius="lg"
                            border="1px solid"
                            borderColor="status.warning"
                        >
                            <VStack gap={2} align="flex-start">
                                <Text fontWeight="semibold" color="status.warning">
                                    ⚠️ Il link di attivazione è scaduto
                                </Text>
                                <Text fontSize="sm" color="text.onPage">
                                    Il link di attivazione è valido per 24 ore. Richiedi un nuovo link per attivare il tuo account.
                                </Text>
                            </VStack>
                        </Box>

                        {resendSuccess ? (
                            <Box
                                w="full"
                                bg="status.successLight"
                                p={6}
                                borderRadius="lg"
                                border="1px solid"
                                borderColor="status.success"
                            >
                                <VStack gap={2} align="flex-start">
                                    <Text fontWeight="semibold" color="status.success">
                                        ✓ Email inviata!
                                    </Text>
                                    <Text fontSize="sm" color="text.onPage">
                                        Controlla la tua casella email (anche nella cartella spam) per il nuovo link di attivazione.
                                    </Text>
                                </VStack>
                            </Box>
                        ) : (
                            <Box w="full" bg="neutralLight.default" p={6} borderRadius="lg">
                                <VStack gap={4} align="stretch">
                                    <VStack align="flex-start" gap={2}>
                                        <Text fontSize="sm" fontWeight="semibold" color="text.onPage">
                                            Indirizzo Email
                                        </Text>
                                        <Input
                                            type="email"
                                            placeholder="tua@email.com"
                                            value={resendEmail}
                                            onChange={(e) => setResendEmail(e.target.value)}
                                            disabled={resendLoading}
                                            w="full"
                                        />
                                    </VStack>

                                    {captchaError && (
                                        <Text fontSize="sm" color="status.error">
                                            {captchaError}
                                        </Text>
                                    )}

                                    <Box>
                                        <HCaptchaWidget
                                            onVerify={(token) => {
                                                setResendCaptchaToken(token);
                                                setCaptchaError(null);
                                            }}
                                            onError={() => {
                                                setResendCaptchaToken(null);
                                                setCaptchaError('Errore nella verifica CAPTCHA. Riprova.');
                                            }}
                                        />
                                    </Box>

                                    {error && (
                                        <Text fontSize="sm" color="status.error">
                                            {error}
                                        </Text>
                                    )}

                                    <Button
                                        size="lg"
                                        w="full"
                                        onClick={handleResendActivation}
                                        disabled={resendLoading || !resendCaptchaToken || !resendEmail}
                                    >
                                        {resendLoading ? 'Invio in corso...' : 'Invia Nuovo Link di Attivazione'}
                                    </Button>
                                </VStack>
                            </Box>
                        )}

                        <Button asChild variant="outline" w="full">
                            <Link href="/">Torna alla Home</Link>
                        </Button>
                    </VStack>
                </Container>
            </Box>
        );
    }

    // Error state
    if (state === 'error') {
        return (
            <Box pt={20} minH="100vh" bg="surface.page">
                <Container maxW="container.md" px={[4, 6, 8]} py={[16, 20, 24]}>
                    <VStack gap={8} textAlign="center">
                        <Box fontSize="6xl">❌</Box>

                        <Heading as="h1" textStyle="h2" color="heading.onPage">
                            Errore di Attivazione
                        </Heading>

                        <Box
                            w="full"
                            bg="status.errorLight"
                            p={6}
                            borderRadius="lg"
                            border="1px solid"
                            borderColor="status.error"
                        >
                            <Text color="status.error">
                                {error || 'Si è verificato un errore durante l\'attivazione'}
                            </Text>
                        </Box>

                        <Button asChild size="lg" w="full">
                            <Link href="/">Torna alla Home</Link>
                        </Button>
                    </VStack>
                </Container>
            </Box>
        );
    }

    // Form state (default)
    return (
        <Box pt={20} minH="100vh" bg="surface.page">
            <Container maxW="container.md" px={[4, 6, 8]} py={[16, 20, 24]}>
                <VStack gap={8}>
                    <VStack gap={4} textAlign="center">
                        <Heading as="h1" textStyle="h2" color="heading.onPage">
                            Attiva il tuo Account
                        </Heading>
                        <Text fontSize="lg" color="text.onPage">
                            Imposta la tua password per completare l'attivazione
                        </Text>
                    </VStack>

                    <Box w="full" bg="neutralLight.default" p={6} borderRadius="lg">
                        <VStack gap={4} align="stretch">
                            <VStack align="flex-start" gap={2}>
                                <Text fontSize="sm" fontWeight="semibold" color="text.onPage">
                                    Nome (opzionale)
                                </Text>
                                <Input
                                    type="text"
                                    placeholder="Il tuo nome"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={loading}
                                    w="full"
                                />
                            </VStack>

                            <VStack align="flex-start" gap={2}>
                                <Text fontSize="sm" fontWeight="semibold" color="text.onPage">
                                    Password
                                </Text>
                                <Input
                                    type="password"
                                    placeholder="Almeno 8 caratteri, una maiuscola, una minuscola e un numero"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setPasswordError(null);
                                    }}
                                    disabled={loading}
                                    w="full"
                                    borderColor={passwordError ? "status.error" : undefined}
                                />
                                {passwordError && (
                                    <Text fontSize="xs" color="status.error">
                                        {passwordError}
                                    </Text>
                                )}
                            </VStack>

                            <VStack align="flex-start" gap={2}>
                                <Text fontSize="sm" fontWeight="semibold" color="text.onPage">
                                    Conferma Password
                                </Text>
                                <Input
                                    type="password"
                                    placeholder="Ripeti la password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setPasswordError(null);
                                    }}
                                    disabled={loading}
                                    w="full"
                                />
                            </VStack>

                            {captchaError && (
                                <Text fontSize="sm" color="status.error">
                                    {captchaError}
                                </Text>
                            )}

                            <Box>
                                <HCaptchaWidget
                                    onVerify={(token) => {
                                        setCaptchaToken(token);
                                        setCaptchaError(null);
                                    }}
                                    onError={() => {
                                        setCaptchaToken(null);
                                        setCaptchaError('Errore nella verifica CAPTCHA. Riprova.');
                                    }}
                                />
                            </Box>

                            {error && (
                                <Text fontSize="sm" color="status.error">
                                    {error}
                                </Text>
                            )}

                            <Button
                                size="lg"
                                w="full"
                                onClick={handleActivate}
                                disabled={loading || !captchaToken || !password || !confirmPassword}
                            >
                                {loading ? 'Attivazione in corso...' : 'Attiva Account'}
                            </Button>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
}

export default function ActivatePage() {
    return (
        <Suspense fallback={
            <Box pt={20} minH="100vh" bg="surface.page">
                <Container maxW="container.md" px={[4, 6, 8]} py={[16, 20, 24]}>
                    <VStack gap={4} textAlign="center">
                        <Text>Caricamento...</Text>
                    </VStack>
                </Container>
            </Box>
        }>
            <ActivateContent />
        </Suspense>
    );
}

