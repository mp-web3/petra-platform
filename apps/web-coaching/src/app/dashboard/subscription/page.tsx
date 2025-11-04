'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Heading,
    Button,
    Card,
    Text,
    VStack,
    HStack,
    Alert,
    Spinner,
    Badge,
    Divider,
    useToast,
} from '@chakra-ui/react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';
import type { Subscription } from '@petra/types';

export default function SubscriptionPage() {
    const { logout } = useAuth();
    const toast = useToast();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadSubscription();
    }, []);

    const loadSubscription = async () => {
        try {
            setLoading(true);
            const response = await apiClient.subscription.getSubscription();
            setSubscription(response.subscription);
        } catch (error: any) {
            if (error.response?.status === 401) {
                logout();
            } else {
                toast({
                    title: 'Error',
                    description: 'Failed to load subscription',
                    status: 'error',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (cancelImmediately: boolean = false) => {
        if (!subscription) return;

        const confirmed = window.confirm(
            cancelImmediately
                ? 'Are you sure you want to cancel immediately? You will lose access right away.'
                : 'Cancel subscription at the end of the current period?'
        );

        if (!confirmed) return;

        try {
            setActionLoading(true);
            const response = await apiClient.subscription.cancelSubscription(cancelImmediately);
            setSubscription(response.subscription);
            toast({
                title: 'Success',
                description: response.message,
                status: 'success',
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to cancel subscription',
                status: 'error',
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleReactivate = async () => {
        if (!subscription) return;

        try {
            setActionLoading(true);
            const response = await apiClient.subscription.reactivateSubscription();
            setSubscription(response.subscription);
            toast({
                title: 'Success',
                description: response.message,
                status: 'success',
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to reactivate subscription',
                status: 'error',
            });
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getPlanName = (planType: string) => {
        const names: Record<string, string> = {
            WOMAN_STARTER: 'Piano Donna - Starter',
            WOMAN_PREMIUM: 'Piano Donna - Premium',
            MAN_STARTER: 'Piano Uomo - Starter',
            MAN_PREMIUM: 'Piano Uomo - Premium',
        };
        return names[planType] || planType;
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            ACTIVE: 'green',
            CANCELLED: 'red',
            PAST_DUE: 'orange',
            TRIALING: 'blue',
            INCOMPLETE: 'gray',
        };
        return colors[status] || 'gray';
    };

    return (
        <Container maxW="container.lg" py={10}>
            <VStack spacing={6} align="stretch">
                <Heading size="2xl">Subscription Management</Heading>

                {loading ? (
                    <Box textAlign="center" py={10}>
                        <Spinner size="xl" />
                        <Text mt={4}>Loading subscription...</Text>
                    </Box>
                ) : subscription ? (
                    <Card.Root>
                        <Card.Header>
                            <HStack justify="space-between">
                                <VStack align="start" spacing={1}>
                                    <Heading size="lg">{getPlanName(subscription.planType)}</Heading>
                                    <Text color="gray.600">
                                        {subscription.duration.replace('WEEKS_', '')} weeks
                                    </Text>
                                </VStack>
                                <Badge colorPalette={getStatusColor(subscription.status)} size="lg">
                                    {subscription.status}
                                </Badge>
                            </HStack>
                        </Card.Header>

                        <Card.Body>
                            <VStack spacing={4} align="stretch">
                                <Box>
                                    <Text fontSize="sm" color="gray.600" mb={1}>
                                        Current Period
                                    </Text>
                                    <Text fontWeight="medium">
                                        {formatDate(subscription.currentPeriodStart)} -{' '}
                                        {formatDate(subscription.currentPeriodEnd)}
                                    </Text>
                                </Box>

                                <Divider />

                                {subscription.cancelAtPeriodEnd && (
                                    <Alert status="warning">
                                        <VStack align="start" spacing={1}>
                                            <Text fontWeight="bold">
                                                Subscription will cancel at period end
                                            </Text>
                                            <Text fontSize="sm">
                                                Your access will continue until{' '}
                                                {formatDate(subscription.currentPeriodEnd)}
                                            </Text>
                                        </VStack>
                                    </Alert>
                                )}

                                {subscription.status === 'CANCELLED' && (
                                    <Alert status="error">
                                        Your subscription has been cancelled
                                    </Alert>
                                )}
                            </VStack>
                        </Card.Body>

                        <Card.Footer>
                            <VStack spacing={3} w="full">
                                {subscription.status === 'ACTIVE' && !subscription.cancelAtPeriodEnd && (
                                    <>
                                        <Button
                                            colorPalette="orange"
                                            w="full"
                                            onClick={() => handleCancel(false)}
                                            loading={actionLoading}
                                        >
                                            Cancel at Period End
                                        </Button>
                                        <Button
                                            colorPalette="red"
                                            variant="outline"
                                            w="full"
                                            onClick={() => handleCancel(true)}
                                            loading={actionLoading}
                                        >
                                            Cancel Immediately
                                        </Button>
                                    </>
                                )}

                                {subscription.status === 'ACTIVE' && subscription.cancelAtPeriodEnd && (
                                    <Button
                                        colorPalette="green"
                                        w="full"
                                        onClick={handleReactivate}
                                        loading={actionLoading}
                                    >
                                        Reactivate Subscription
                                    </Button>
                                )}

                                {subscription.status === 'CANCELLED' && (
                                    <Alert status="info" w="full">
                                        This subscription has been cancelled. To continue your coaching,
                                        please purchase a new plan.
                                    </Alert>
                                )}
                            </VStack>
                        </Card.Footer>
                    </Card.Root>
                ) : (
                    <Alert status="info">
                        <VStack align="start" spacing={2}>
                            <Text fontWeight="bold">No active subscription</Text>
                            <Text fontSize="sm">
                                You don't have an active subscription. Purchase a plan to get started.
                            </Text>
                            <Button
                                as="a"
                                href="/"
                                colorPalette="blue"
                                size="sm"
                                mt={2}
                            >
                                View Plans
                            </Button>
                        </VStack>
                    </Alert>
                )}
            </VStack>
        </Container>
    );
}
