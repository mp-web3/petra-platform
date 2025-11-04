'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Button,
    Input,
    Field,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, isAuthenticated, loading: authLoading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const redirect = searchParams.get('redirect') || '/dashboard';

    // Redirect if already authenticated
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push(redirect);
        }
    }, [isAuthenticated, authLoading, redirect, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(email, password);
            router.push(redirect);
        } catch (err: any) {
            console.error('Login error:', err);
            let errorMessage = 'Si è verificato un errore durante il login. Riprova più tardi.';
            if (err?.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err?.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err?.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
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

    return (
        <Box pt={20} minH="100vh" bg="surface.page">
            <Container maxW="container.md" px={[4, 6, 8]} py={[16, 20, 24]}>
                <VStack gap={8}>
                    <VStack gap={4} textAlign="center">
                        <Heading as="h1" textStyle="h2" color="heading.onPage">
                            Accedi al tuo Account
                        </Heading>
                        <Text fontSize="lg" color="text.onPage">
                            Inserisci le tue credenziali per accedere
                        </Text>
                    </VStack>

                    <Box w="full" bg="neutralLight.default" p={6} borderRadius="lg">
                        <form onSubmit={handleSubmit}>
                            <VStack gap={4} align="stretch">
                                <Field.Root required>
                                    <Field.Label fontSize="sm" fontWeight="semibold" color="text.onPage">
                                        Email
                                    </Field.Label>
                                    <Input
                                        type="email"
                                        placeholder="tua@email.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError(null);
                                        }}
                                        disabled={loading}
                                        w="full"
                                        size="lg"
                                    />
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label fontSize="sm" fontWeight="semibold" color="text.onPage">
                                        Password
                                    </Field.Label>
                                    <HStack w="full" gap={2}>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="La tua password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setError(null);
                                            }}
                                            disabled={loading}
                                            flex={1}
                                            size="lg"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="lg"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                                            type="button"
                                        >
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </Button>
                                    </HStack>
                                </Field.Root>

                                {error && (
                                    <Box w="full" bg="status.errorLight" p={4} borderRadius="md">
                                        <Text fontSize="sm" color="status.error">
                                            {error}
                                        </Text>
                                    </Box>
                                )}

                                <Button
                                    type="submit"
                                    size="lg"
                                    w="full"
                                    disabled={loading || !email || !password}
                                    loading={loading}
                                >
                                    {loading ? 'Accesso in corso...' : 'Accedi'}
                                </Button>

                                <VStack gap={2} w="full" pt={4}>
                                    <Text fontSize="sm" color="text.muted" textAlign="center">
                                        Non hai ancora un account?{' '}
                                        <Link href="/coaching-donna-online#piani" style={{ color: 'var(--chakra-colors-primary-default)' }}>
                                            Iscriviti qui
                                        </Link>
                                    </Text>
                                </VStack>
                            </VStack>
                        </form>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
}

