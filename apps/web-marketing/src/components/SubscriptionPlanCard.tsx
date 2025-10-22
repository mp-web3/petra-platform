import Link from 'next/link';
import Image from 'next/image';
import { Button, HStack, Heading, Text, VStack } from '@petra/ui';
import type { PlanFeatures } from '@/lib';

export interface SubscriptionPlanCardProps {
  title: string;
  subtitle?: string;
  priceLabel: string;
  ctaText: string;
  onCtaClick?: () => void;
  ctaHref?: string;
  features: PlanFeatures[];
  highlighted?: boolean;
}

export default function SubscriptionPlanCard({
  title,
  subtitle,
  priceLabel,
  ctaText,
  onCtaClick,
  ctaHref,
  features,
  highlighted = false,
}: SubscriptionPlanCardProps) {
  const buttonEl = (
    <Button
      onClick={onCtaClick}
      bg="surface.action"
      color="text.onSurfaceAction"
      textStyle="button"
      px={8}
      py={4}
      borderRadius="md"
      _hover={{ bg: 'interactive.primaryHover' }}
      w="full"
    >
      {ctaText}
    </Button>
  );

  return (
    <VStack
      bg={highlighted ? 'surface.card.dark' : 'neutralLight.default'}
      color="text.onPage"
      borderRadius="lg"
      boxShadow="md"
      p={6}
      w={['100%']}
      maxW={['100%', '500px']}
      flexShrink={0}
      css={{ scrollSnapAlign: 'start' }}
      gap={6}
    >
      <VStack gap={2} w="full" align="flex-start">
        <Heading as="h3" textStyle="h3" color="heading.onPage">
          {title}
        </Heading>
        {subtitle && (
          <Text textStyle="lg" color={highlighted ? 'text.onDark' : 'text.onLight'}>
            {subtitle}
          </Text>
        )}
      </VStack>

      <Heading as="p" size="3xl" color="primary.default">
        {priceLabel}
      </Heading>

      <VStack as="ul" m={0} p={0} w="full" align="flex-start" gap={3}>
        {features.map((f) => (
          <HStack as="li" key={f.id} alignItems="flex-start" gap={3}>
            <Image
              src={(f.checked ?? true) ? '/icons/done_primary.svg' : '/icons/close_primary.svg'}
              alt=""
              width={20}
              height={20}
              style={{ marginTop: '2px' }}
            />
            <Text textStyle="md" color={highlighted ? 'text.onDark' : 'text.onLight'}>
              {f.label}
            </Text>
          </HStack>
        ))}
      </VStack>

      {ctaHref ? <Link href={ctaHref} style={{ width: '100%' }}>{buttonEl}</Link> : buttonEl}
    </VStack>
  );
}

