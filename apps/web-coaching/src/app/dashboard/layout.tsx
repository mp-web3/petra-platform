'use client';

import { useRouter } from 'next/navigation';
import {
    Box,
    Container,
    HStack,
    Button,
    Heading,
    Link,
    Text,
} from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout } = useAuth();
    const router = useRouter();

    return (
        <ProtectedRoute>
            <Box minH="100vh" bg="gray.50">
                <Box bg="white" borderBottom="1px" borderColor="gray.200" py={4}>
                    <Container maxW="container.xl">
                        <HStack justify="space-between">
                            <Heading size="lg">Petra Coaching</Heading>
                            <HStack spacing={4}>
                                <Button as="a" href="/dashboard" variant="ghost">Dashboard</Button>
                                <Button as="a" href="/dashboard/subscription" variant="ghost">Subscription</Button>
                                <Text fontSize="sm" color="gray.600">{user?.email}</Text>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        logout();
                                        router.push('/login');
                                    }}
                                >
                                    Logout
                                </Button>
                            </HStack>
                        </HStack>
                    </Container>
                </Box>
                {children}
            </Box>
        </ProtectedRoute>
    );
}
