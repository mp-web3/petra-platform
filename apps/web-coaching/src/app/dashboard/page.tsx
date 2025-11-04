'use client';

import {
    Container,
    Heading,
    Text,
    VStack,
    Box,
    Button,
    Link,
} from '@chakra-ui/react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <ProtectedRoute>
            <Container maxW="container.xl" py={10}>
                <VStack spacing={6} align="stretch">
                    <Box>
                        <Heading size="2xl" mb={2}>
                            Welcome back{user?.name ? `, ${user.name}` : ''}!
                        </Heading>
                        <Text color="gray.600">
                            Manage your subscription and access your coaching content
                        </Text>
                    </Box>

                    <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        <Box
                            p={6}
                            borderWidth="1px"
                            borderRadius="lg"
                            bg="white"
                        >
                            <Heading size="lg" mb={2}>Subscription</Heading>
                            <Text color="gray.600" mb={4}>
                                Manage your subscription, view billing, and cancel if needed
                            </Text>
                            <Button as={Link} href="/dashboard/subscription" colorPalette="blue">
                                Manage Subscription
                            </Button>
                        </Box>

                        <Box
                            p={6}
                            borderWidth="1px"
                            borderRadius="lg"
                            bg="white"
                        >
                            <Heading size="lg" mb={2}>Workouts</Heading>
                            <Text color="gray.600" mb={4}>
                                Access your personalized workout plans
                            </Text>
                            <Button variant="outline" disabled>
                                Coming Soon
                            </Button>
                        </Box>
                    </Box>
                </VStack>
            </Container>
        </ProtectedRoute>
    );
}
