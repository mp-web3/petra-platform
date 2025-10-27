import { HStack, Heading, Image, Stack, Text, VStack } from '@chakra-ui/react';

interface FeaturesItem {
  featureIconSrc: string;
  featureIconAlt: string;
  featureTitle: string;
  featureText: string;
}

type FeatureSingleProps = {
  featureIconSrc: string;
  featureIconAlt: string;
  featureTitle: string;
  featureText: string;
};

type FeaturesListProps = {
  heading?: string;
  items: FeaturesItem[];
};

function FeatureRow({
  featureIconSrc,
  featureIconAlt,
  featureTitle,
  featureText,
}: FeaturesItem) {
  return (
    <HStack align="flex-start" gap={4}>
      <Image
        src={featureIconSrc}
        alt={featureIconAlt}
        boxSize={5}
        objectFit="contain"
        flexShrink={0}
      />

      <VStack align="flex-start" gap={3} flex={1}>
        <Heading as="h3" size="md" color="heading.onDark" textTransform="uppercase">
          {featureTitle}
        </Heading>
        <Text textStyle="md" color="text.onDark">
          {featureText}
        </Text>
      </VStack>
    </HStack>
  );
}

export default function Features(props: FeaturesListProps | FeatureSingleProps) {
  if ('items' in props) {
    const { heading, items } = props;
    return (
      <VStack w="full" px={[4, 6, 8]} py={[12, 16, 20]} gap={8}>
        {heading && (
          <Heading
            as="h2"
            textStyle="h2"
            color="heading.onPage"
            lineHeight={1}
            textAlign="left"
            w="full"
          >
            {heading}
          </Heading>
        )}
        <Stack position="relative" gap={8}>
          {items.map((item) => (
            <FeatureRow key={item.featureTitle} {...item} />
          ))}
        </Stack>
      </VStack>
    );
  }

  const { featureIconSrc, featureIconAlt, featureTitle, featureText } = props;
  return (
    <FeatureRow
      featureIconSrc={featureIconSrc}
      featureIconAlt={featureIconAlt}
      featureTitle={featureTitle}
      featureText={featureText}
    />
  );
}

