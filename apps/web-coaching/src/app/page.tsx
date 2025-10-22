import { Box, Heading, Text, Button, Container } from '@petra/ui';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container maxW="container.xl" py={20}>
      <Box textAlign="center">
        <Heading size="4xl" mb={4} color="primary">
          Petra Coaching Platform
        </Heading>
        <Text fontSize="xl" mb={8} color="text.muted">
          Your personalized online coaching experience
        </Text>
        <Box display="flex" gap={4} justifyContent="center">
          <Button asChild size="lg" colorPalette="teal">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/register">Get Started</Link>
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

