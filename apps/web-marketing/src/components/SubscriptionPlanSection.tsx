import { Box, Heading, Text, VStack } from '@petra/ui';
import type { SubscriptionPlanCardProps } from './SubscriptionPlanCard';
import SubscriptionPlanCardsSlider from './SubscriptionPlanCardsCarousel';

interface SubscriptionPlanSectionProps {
  header: string;
  subHeader: string;
  plans: SubscriptionPlanCardProps[];
}

export default function SubscriptionPlanSection({
  header,
  subHeader,
  plans,
}: SubscriptionPlanSectionProps) {
  return (
    <Box py={[16, 20, 24]} mx="auto" alignItems="stretch" justifyItems="center">
      <VStack align="center" justify="center" gap={[4, 4, 8]} w="100%">
        <Heading as="h2" textStyle="h2" color="text.onPage" lineHeight={1}>
          {header}
        </Heading>
        <Text textStyle="subHeader" color="text.muted" alignSelf="center" textAlign="center">
          {subHeader}
        </Text>
        <SubscriptionPlanCardsSlider plans={plans} />
      </VStack>
    </Box>
  );
}

