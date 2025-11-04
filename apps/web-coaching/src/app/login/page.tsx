'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Container,
    Heading,
    Input,
    Button,
    FormControl,
    FormLabel,
    Text,
    Alert,
    VStack,
    HStack,
} from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxW="container.sm" py={20}>
            <VStack spacing={8}>
                <Box textAlign="center" w="full">
                    <Heading size="2xl" mb={2}>
                        Welcome Back
                    </Heading>
                    <Text color="gray.600">
                        Sign in to access your coaching platform
                    </Text>
                </Box>

                <Box w="full" maxW="md">
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={6}>
                            {error && (
                                <Alert status="error" w="full">
                                    {error}
                                </Alert>
                            )}

                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    size="lg"
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    size="lg"
                                />
                            </FormControl>

                            <Button
                                type="submit"
                                colorPalette="blue"
                                size="lg"
                                w="full"
                                loading={loading}
                            >
                                Sign In
                            </Button>

                            <Text fontSize="sm" color="gray.600" textAlign="center">
                                Don't have an account? Check your email for the activation link
                                after completing checkout.
                            </Text>
                        </VStack>
                    </form>
                </Box>
            </VStack>
        </Container>
    );
}
