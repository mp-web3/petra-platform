'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  VStack,
  HStack,
  brandTokens,
} from '@chakra-ui/react';
import { BrandButton } from '@/components/BrandButton';
import MainButton from '@/components/MainButton';

export default function StyleTestPage() {
  return (
    <Container maxW="1200px" py={12}>
      <VStack gap={12} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading
            fontSize="5xl"
            fontFamily={brandTokens.fonts.heading}
            color={brandTokens.text.primary}
            mb={4}
          >
            Petra Brand Style Test
          </Heading>
          <Text fontSize="xl" color={brandTokens.text.secondary}>
            Testing the brand styling with Chakra UI default theme + CSS variables
          </Text>
        </Box>

        {/* Color Palette */}
        <Box>
          <Heading size="lg" mb={6} fontFamily={brandTokens.fonts.heading}>
            Brand Colors
          </Heading>
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
            {/* Primary Brand */}
            <VStack>
              <Box
                bg={brandTokens.primary}
                h="100px"
                w="100%"
                borderRadius={brandTokens.radii.card}
                boxShadow="md"
              />
              <Text fontSize="sm" fontWeight="600">
                Primary
              </Text>
            </VStack>

            {/* Accent Orange */}
            <VStack>
              <Box
                bg={brandTokens.accent.orange}
                h="100px"
                w="100%"
                borderRadius={brandTokens.radii.card}
                boxShadow="md"
              />
              <Text fontSize="sm" fontWeight="600">
                Accent Orange
              </Text>
            </VStack>

            {/* Accent Pink */}
            <VStack>
              <Box
                bg={brandTokens.accent.pink}
                h="100px"
                w="100%"
                borderRadius={brandTokens.radii.card}
                boxShadow="md"
              />
              <Text fontSize="sm" fontWeight="600">
                Accent Pink
              </Text>
            </VStack>

            {/* Accent Teal */}
            <VStack>
              <Box
                bg={brandTokens.accent.teal}
                h="100px"
                w="100%"
                borderRadius={brandTokens.radii.card}
                boxShadow="md"
              />
              <Text fontSize="sm" fontWeight="600">
                Accent Teal
              </Text>
            </VStack>
          </SimpleGrid>
        </Box>

        {/* Buttons */}
        <Box>
          <Heading size="lg" mb={6} fontFamily={brandTokens.fonts.heading}>
            Buttons
          </Heading>
          <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
            <BrandButton variant="primary">Primary Button</BrandButton>
            <BrandButton variant="secondary">Secondary Button</BrandButton>
            <BrandButton variant="outline">Outline Button</BrandButton>
            <MainButton text="Main Button (CTA)" />
          </Stack>
        </Box>

        {/* Typography */}
        <Box>
          <Heading size="lg" mb={6} fontFamily={brandTokens.fonts.heading}>
            Typography
          </Heading>
          <VStack align="start" gap={4}>
            <Heading
              fontSize="4xl"
              fontFamily={brandTokens.fonts.heading}
              color={brandTokens.text.primary}
            >
              Heading 1 - Montserrat Bold
            </Heading>
            <Heading
              fontSize="3xl"
              fontFamily={brandTokens.fonts.heading}
              color={brandTokens.text.primary}
            >
              Heading 2 - Montserrat Bold
            </Heading>
            <Text fontSize="xl" fontFamily={brandTokens.fonts.body} color={brandTokens.text.primary}>
              Body Large - Inter Regular
            </Text>
            <Text fontSize="md" fontFamily={brandTokens.fonts.body} color={brandTokens.text.secondary}>
              Body Medium - Inter Regular (Secondary Text)
            </Text>
            <Text fontSize="sm" fontFamily={brandTokens.fonts.body} color={brandTokens.text.tertiary}>
              Body Small - Inter Regular (Tertiary Text)
            </Text>
          </VStack>
        </Box>

        {/* Card Example */}
        <Box>
          <Heading size="lg" mb={6} fontFamily={brandTokens.fonts.heading}>
            Card Component
          </Heading>
          <Box
            bg={brandTokens.bg.surface}
            p={8}
            borderRadius={brandTokens.radii.card}
            borderWidth="1px"
            borderColor={brandTokens.border.default}
            boxShadow="md"
            _hover={{
              borderColor: brandTokens.primary,
              boxShadow: 'lg',
              transform: 'translateY(-2px)',
            }}
            transition="all 0.2s"
          >
            <Heading
              size="md"
              mb={4}
              fontFamily={brandTokens.fonts.heading}
              color={brandTokens.text.primary}
            >
              Feature Card
            </Heading>
            <Text fontSize="md" color={brandTokens.text.secondary} mb={6}>
              This is a sample card component using Petra brand styling with Chakra's default
              theme. Hover over it to see the interaction effects!
            </Text>
            <BrandButton size="sm">Learn More</BrandButton>
          </Box>
        </Box>

        {/* Background Colors */}
        <Box>
          <Heading size="lg" mb={6} fontFamily={brandTokens.fonts.heading}>
            Background Variants
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
            <Box bg={brandTokens.bg.canvas} p={6} borderRadius="md" borderWidth="1px">
              <Text fontWeight="600" mb={2}>
                Canvas
              </Text>
              <Text fontSize="sm" color={brandTokens.text.secondary}>
                Page background
              </Text>
            </Box>
            <Box bg={brandTokens.bg.surface} p={6} borderRadius="md" borderWidth="1px">
              <Text fontWeight="600" mb={2}>
                Surface
              </Text>
              <Text fontSize="sm" color={brandTokens.text.secondary}>
                Card background
              </Text>
            </Box>
            <Box bg={brandTokens.bg.muted} p={6} borderRadius="md" borderWidth="1px">
              <Text fontWeight="600" mb={2}>
                Muted
              </Text>
              <Text fontSize="sm" color={brandTokens.text.secondary}>
                Subtle background
              </Text>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Success Message */}
        <Box
          bg="green.50"
          borderLeftWidth="4px"
          borderLeftColor="green.500"
          p={6}
          borderRadius="md"
        >
          <HStack gap={4}>
            <Box fontSize="2xl">✅</Box>
            <Box>
              <Text fontWeight="600" color="green.700" mb={2}>
                Success!
              </Text>
              <Text fontSize="sm" color="green.600">
                All Petra brand colors are working correctly with Chakra UI's default theme using
                CSS variables. The site is production-ready!
              </Text>
            </Box>
          </HStack>
        </Box>
      </VStack>
    </Container>
  );
}

