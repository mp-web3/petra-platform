import { Box, Heading, Image, SimpleGrid, VStack } from '@chakra-ui/react';
import Features from './Features';

interface FeatureItem {
  featureIconSrc: string;
  featureIconAlt: string;
  featureTitle: string;
  featureText: string;
}

interface AppAccessSectionProps {
  heading?: string;
  features: FeatureItem[];
  mockupImageSrc?: string;
  mockupImageAlt?: string;
}

export default function AppAccessSection({
  heading = "accesso all'app",
  features,
  mockupImageSrc,
  mockupImageAlt = 'App mockup',
}: AppAccessSectionProps) {
  return (
    <Box backgroundColor="surface.dark">
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        gap={[11, 6, 8]}
        px={[4, 6, 8]}
        py={[16, 20, 24]}
        mx="auto"
        alignItems="stretch"
        justifyItems="flex-start"
        w="100%"
      >
        <VStack align="flex-start" gap={[4, 4, 8]}>
          <Heading as="h2" textStyle="h2" color="heading.onDark" lineHeight={1}>
            {heading}
          </Heading>
          <Features heading={undefined} items={features} />
        </VStack>
        {mockupImageSrc && (
          <Image
            src={mockupImageSrc}
            aspectRatio="1/1"
            alt={mockupImageAlt}
          />
        )}
      </SimpleGrid>
    </Box>
  );
}

