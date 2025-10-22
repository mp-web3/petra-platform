import { Box, Heading, Text, Button, Container, Stack } from '@petra/ui';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Box bg="surface.page" minH="100vh">
      {/* Hero Section */}
      <Container maxW="container.xl" py={20}>
        <Stack gap={8} align="center" textAlign="center">
          <Heading size="4xl" color="heading.onPage">
            Transform Your Life with Petra
          </Heading>
          <Text fontSize="2xl" color="text.secondary" maxW="3xl">
            Personalized online coaching programs for women and men. Get fit, stay healthy, and
            achieve your goals with expert guidance.
          </Text>
          <Box display="flex" gap={4}>
            <Button asChild size="lg" colorPalette="red">
              <Link href="/plans">View Plans</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">Learn More</Link>
            </Button>
          </Box>
        </Stack>
      </Container>

      {/* Features Section */}
      <Container maxW="container.xl" py={16}>
        <Heading size="3xl" textAlign="center" mb={12} color="heading.onPage">
          Why Choose Petra
        </Heading>
        <Box
          display="grid"
          gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
          gap={8}
        >
          <FeatureCard
            title="Personalized Plans"
            description="Custom workout and nutrition plans tailored to your goals and lifestyle"
          />
          <FeatureCard
            title="Expert Coaching"
            description="Professional guidance from certified trainers with years of experience"
          />
          <FeatureCard
            title="Flexible Access"
            description="Train anywhere, anytime with our mobile-friendly platform"
          />
        </Box>
      </Container>
    </Box>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <Box p={6} bg="surface.elevated" borderRadius="lg">
      <Heading size="xl" mb={4} color="heading.onPage">
        {title}
      </Heading>
      <Text color="text.secondary">{description}</Text>
    </Box>
  );
}

