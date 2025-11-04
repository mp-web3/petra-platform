'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Button,
    Badge,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { createApiClient } from '@petra/api-client';
import type { Subscription } from '@petra/types';
import { SubscriptionStatus } from '@petra/types';

function DashboardContent() {
    const { user, logout, refreshUser } = useAuth();
    const router = useRouter();
    const apiClient = createApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [reactivating, setReactivating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSubscription();
    }, []);

    const loadSubscription = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.subscription.getSubscription();
            setSubscription(response.subscription);
        } catch (err: any) {
            console.error('Error loading subscription:', err);
            if (err?.response?.status === 401) {
                // Token expired, logout
                logout();
                router.push('/login');
            } else {
                setError('Errore nel caricamento dell\'abbonamento. Riprova più tardi.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (cancelImmediately: boolean = false) => {
        if (!subscription) return;

        const confirmMessage = cancelImmediately
            ? 'Sei sicuro di voler cancellare immediatamente l\'abbonamento? Perderai l\'accesso subito.'
            : 'Sei sicuro di voler cancellare l\'abbonamento? L\'abbonamento continuerà fino alla fine del periodo corrente.';

        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            setCancelling(true);
            setError(null);
            const response = await apiClient.subscription.cancelSubscription(cancelImmediately);
            setSubscription(response.subscription);
            await refreshUser();
        } catch (err: any) {
            console.error('Error cancelling subscription:', err);
            let errorMessage = 'Errore durante la cancellazione. Riprova più tardi.';
            if (err?.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err?.response?.data?.error) {
                errorMessage = err.response.data.error;
            }
            setError(errorMessage);
        } finally {
            setCancelling(false);
        }
    };

    const handleReactivate = async () => {
        if (!subscription) return;

        if (!window.confirm('Sei sicuro di voler riattivare l\'abbonamento?')) {
            return;
        }

        try {
            setReactivating(true);
            setError(null);
            const response = await apiClient.subscription.reactivateSubscription();
            setSubscription(response.subscription);
            await refreshUser();
        } catch (err: any) {
            console.error('Error reactivating subscription:', err);
            let errorMessage = 'Errore durante la riattivazione. Riprova più tardi.';
            if (err?.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err?.response?.data?.error) {
                errorMessage = err.response.data.error;
            }
            setError(errorMessage);
        } finally {
            setReactivating(false);
        }
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusBadge = (status: SubscriptionStatus) => {
        const statusMap = {
            [SubscriptionStatus.ACTIVE]: { label: 'Attivo', color: 'status.success' },
            [SubscriptionStatus.CANCELLED]: { label: 'Cancellato', color: 'status.error' },
            [SubscriptionStatus.PAST_DUE]: { label: 'Scaduto', color: 'status.warning' },
            [SubscriptionStatus.TRIALING]: { label: 'In Prova', color: 'status.info' },
            [SubscriptionStatus.INCOMPLETE]: { label: 'Incompleto', color: 'status.warning' },
        };

        const statusInfo = statusMap[status] || { label: status, color: 'neutral.default' };
        return (
            <Badge colorPalette={statusInfo.color} size="lg">
                {statusInfo.label}
            </Badge>
        );
    };

    const getPlanName = (planType: string) => {
        const planMap: Record<string, string> = {
            WOMAN_STARTER: 'Donna Starter',
            WOMAN_PREMIUM: 'Donna Premium',
            MAN_STARTER: 'Uomo Starter',
            MAN_PREMIUM: 'Uomo Premium',
        };
        return planMap[planType] || planType;
    };

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

    return (
        <Box pt={20} minH="100vh" bg="surface.page">
            <Container maxW="container.md" px={[4, 6, 8]} py={[16, 20, 24]}>
                <VStack gap={8} align="stretch">
                    {/* Header */}
                    <VStack gap={4} align="flex-start">
                        <HStack justify="space-between" w="full" flexWrap="wrap" gap={4}>
                            <VStack align="flex-start" gap={2}>
                                <Heading as="h1" textStyle="h2" color="heading.onPage">
                                    Il Mio Account
                                </Heading>
                                {user?.name && (
                                    <Text fontSize="lg" color="text.onPage">
                                        Ciao, {user.name}!
                                    </Text>
                                )}
                            </VStack>
                            <Button variant="outline" onClick={logout} size="md">
                                Esci
                            </Button>
                        </HStack>
                    </VStack>

                    {/* User Info */}
                    <Box w="full" bg="neutralLight.default" p={6} borderRadius="lg">
                        <VStack gap={4} align="stretch">
                            <Heading as="h2" textStyle="h3" color="heading.onPage">
                                Informazioni Account
                            </Heading>
                            <VStack gap={2} align="flex-start">
                                <HStack gap={4} flexWrap="wrap">
                                    <Text fontSize="sm" fontWeight="semibold" color="text.muted">
                                        Email:
                                    </Text>
                                    <Text fontSize="sm" color="text.onPage">
                                        {user?.email}
                                    </Text>
                                </HStack>
                                {user?.name && (
                                    <HStack gap={4} flexWrap="wrap">
                                        <Text fontSize="sm" fontWeight="semibold" color="text.muted">
                                            Nome:
                                        </Text>
                                        <Text fontSize="sm" color="text.onPage">
                                            {user.name}
                                        </Text>
                                    </HStack>
                                )}
                                <HStack gap={4} flexWrap="wrap">
                                    <Text fontSize="sm" fontWeight="semibold" color="text.muted">
                                        Account attivato:
                                    </Text>
                                    <Text fontSize="sm" color="text.onPage">
                                        {user?.activatedAt
                                            ? formatDate(user.activatedAt)
                                            : 'Non attivato'}
                                    </Text>
                                </HStack>
                            </VStack>
                        </VStack>
                    </Box>

                    {/* Subscription Info */}
                    {subscription ? (
                        <Box w="full" bg="neutralLight.default" p={6} borderRadius="lg">
                            <VStack gap={6} align="stretch">
                                    <HStack justify="space-between" flexWrap="wrap" gap={4}>
                                        <Heading as="h2" textStyle="h3" color="heading.onPage">
                                            Il Mio Abbonamento
                                        </Heading>
                                        {getStatusBadge(subscription.status)}
                                    </HStack>

                                    <VStack gap={4} align="stretch">
                                        <HStack gap={4} flexWrap="wrap">
                                            <Text fontSize="sm" fontWeight="semibold" color="text.muted">
                                                Piano:
                                            </Text>
                                            <Text fontSize="sm" color="text.onPage">
                                                {getPlanName(subscription.planType)}
                                            </Text>
                                        </HStack>
                                        <HStack gap={4} flexWrap="wrap">
                                            <Text fontSize="sm" fontWeight="semibold" color="text.muted">
                                                Durata:
                                            </Text>
                                            <Text fontSize="sm" color="text.onPage">
                                                {subscription.duration}
                                            </Text>
                                        </HStack>
                                        <HStack gap={4} flexWrap="wrap">
                                            <Text fontSize="sm" fontWeight="semibold" color="text.muted">
                                                Periodo corrente:
                                            </Text>
                                            <Text fontSize="sm" color="text.onPage">
                                                {formatDate(subscription.currentPeriodStart)} -{' '}
                                                {formatDate(subscription.currentPeriodEnd)}
                                            </Text>
                                        </HStack>
                                        {subscription.cancelAtPeriodEnd && (
                                            <Box
                                                w="full"
                                                bg="status.warningLight"
                                                p={4}
                                                borderRadius="md"
                                                border="1px solid"
                                                borderColor="status.warning"
                                            >
                                                <Text fontSize="sm" color="status.warning">
                                                    ⚠️ L'abbonamento verrà cancellato alla fine del periodo corrente.
                                                </Text>
                                            </Box>
                                        )}
                                    </VStack>

                                    {error && (
                                        <Box w="full" bg="status.errorLight" p={4} borderRadius="md">
                                            <Text fontSize="sm" color="status.error">
                                                {error}
                                            </Text>
                                        </Box>
                                    )}

                                    {/* Subscription Actions */}
                                    <VStack gap={3} align="stretch" pt={4}>
                                        {subscription.status === SubscriptionStatus.ACTIVE &&
                                            !subscription.cancelAtPeriodEnd && (
                                                <VStack gap={2} align="stretch">
                                                    <Button
                                                        variant="outline"
                                                        colorPalette="error"
                                                        onClick={() => handleCancel(false)}
                                                        disabled={cancelling}
                                                        loading={cancelling}
                                                        w="full"
                                                    >
                                                        {cancelling ? 'Cancellazione...' : 'Cancella Abbonamento'}
                                                    </Button>
                                                    <Text fontSize="xs" color="text.muted" textAlign="center">
                                                        L'abbonamento continuerà fino alla fine del periodo corrente.
                                                    </Text>
                                                </VStack>
                                            )}

                                        {subscription.status === SubscriptionStatus.ACTIVE &&
                                            subscription.cancelAtPeriodEnd && (
                                                <Button
                                                    onClick={handleReactivate}
                                                    disabled={reactivating}
                                                    loading={reactivating}
                                                    w="full"
                                                    size="lg"
                                                >
                                                    {reactivating ? 'Riattivazione...' : 'Riattiva Abbonamento'}
                                                </Button>
                                            )}

                                        {subscription.status === SubscriptionStatus.CANCELLED && (
                                            <Box
                                                w="full"
                                                bg="neutralLight.light"
                                                p={4}
                                                borderRadius="md"
                                            >
                                                <Text fontSize="sm" color="text.onPage" textAlign="center">
                                                    L'abbonamento è stato cancellato. Per riattivarlo, contatta il supporto.
                                                </Text>
                                            </Box>
                                        )}
                                    </VStack>
                                </VStack>
                        </Box>
                    ) : (
                        <Box w="full" bg="neutralLight.default" p={6} borderRadius="lg">
                            <VStack gap={6} align="stretch">
                                <Heading as="h2" textStyle="h3" color="heading.onPage">
                                    Nessun Abbonamento
                                </Heading>
                                <Text color="text.onPage">
                                    Non hai ancora un abbonamento attivo. Scegli un piano per iniziare.
                                </Text>
                                <Button asChild size="lg" w="full">
                                    <Link href="/coaching-donna-online#piani">Scegli un Piano</Link>
                                </Button>
                            </VStack>
                        </Box>
                    )}
                </VStack>
            </Container>
        </Box>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}

