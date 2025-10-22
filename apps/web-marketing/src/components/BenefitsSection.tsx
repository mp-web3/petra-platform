import { Box, Heading, SimpleGrid, Text, VStack } from '@petra/ui';
import MainButton from './MainButton';
import FeatureCard from './FeatureCard';

interface BenefitItem {
  iconSrc: string;
  iconAlt: string;
  title: string;
  description: string;
}

interface BenefitsSectionProps {
  heading: string;
  highlight: string;
  items: BenefitItem[];
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  showCta?: boolean;
}

export default function BenefitsSection({
  heading,
  highlight,
  items,
  ctaText,
  ctaHref,
  onCtaClick,
  showCta = true,
}: BenefitsSectionProps) {
  return (
    <Box bg="surface.dark" color="text.onDark" px={[4, 6, 8]} py={[12, 16, 20]}>
      <VStack gap={[8, 10]} align="center" textAlign="center" maxW="container.xl" mx="auto">
        <Heading as="h2" textStyle="h2" color="text.onDark">
          {heading} <Text as="span" color="primary.default">{highlight}</Text>
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={[10, 16]} alignItems="start" w="full">
          {items.map((it) => (
            <FeatureCard
              key={it.title}
              iconSrc={it.iconSrc}
              iconAlt={it.iconAlt}
              title={it.title}
              description={it.description}
              variant="dark"
            />
          ))}
        </SimpleGrid>

        {showCta && <MainButton text={ctaText} href={ctaHref} onClick={onCtaClick} />}
      </VStack>
    </Box>
  );
}

