import { Box, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import MainButton from './MainButton';
import FeatureCard from './FeatureCard';
import type { FeatureCardProps } from './FeatureCard';

interface PersonalTrainingSectionProps {
  heading: string;
  highlight: string;
  subheading: string;
  features: FeatureCardProps[];
  ctaText: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}

export default function PersonalTrainingSection({
  heading,
  highlight,
  subheading,
  features,
  ctaText,
  ctaHref,
  onCtaClick,
}: PersonalTrainingSectionProps) {
  return (
    <Box bg="surface.page" color="text.onPage" px={[4, 6, 8]} py={[12, 16, 20]}>
      <VStack gap={6} maxW="container.xl" mx="auto" textAlign="center">
        <Heading as="h2" textStyle="h2">
          {heading} <Text as="span" color="primary.default">{highlight}</Text>
        </Heading>
        <Text textStyle="subHeader" color="text.muted">
          {subheading}
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={[6, 8]} w="full">
          {features.slice(0, 3).map((f, i) => (
            <FeatureCard key={`${f.title}-${i}`} {...f} />
          ))}
        </SimpleGrid>

        <Text textStyle="sm" color="text.onPage">
          Contattami per verificare che ci siano i requisiti minimi per organizzare la tua
          prima sessione di personal training assieme a me.
        </Text>
        <MainButton text={ctaText} href={ctaHref} onClick={onCtaClick} />
      </VStack>
    </Box>
  );
}

