'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, VStack, Text, Heading } from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Button } from '@chakra-ui/react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login?redirect=/dashboard');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
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

    if (!isAuthenticated) {
        return (
            <Box pt={20} minH="100vh" bg="surface.page">
                <Container maxW="container.md" px={[4, 6, 8]} py={[16, 20, 24]}>
                    <VStack gap={8} textAlign="center">
                        <Heading as="h1" textStyle="h2" color="heading.onPage">
                            Accesso Richiesto
                        </Heading>
                        <Text color="text.onPage">
                            Devi effettuare il login per accedere a questa pagina.
                        </Text>
                        <Button asChild size="lg">
                            <Link href="/login">Vai al Login</Link>
                        </Button>
                    </VStack>
                </Container>
            </Box>
        );
    }

    return <>{children}</>;
}

