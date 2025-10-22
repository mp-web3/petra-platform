import { Box, HStack, Heading, Text, VStack, SimpleGrid } from '@chakra-ui/react';

interface StepItem {
  number: number;
  title: string;
  subtitle?: string;
  bullets: string[];
}

interface StepsProps {
  heading?: string;
  items: StepItem[];
}

export function Step({ number, title, subtitle, bullets }: StepItem) {
  return (
    <HStack align="flex-start" gap={5}>
      <Box
        minW={12}
        h={12}
        borderRadius="full"
        bg="primary.default"
        color="text.onPrimary"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontWeight="bold"
      >
        {number}
      </Box>
      <VStack align="flex-start" gap={3} flex={1}>
        <VStack align="flex-start" gap={1}>
          <Heading as="h3" size="md" color="text.onPage" textTransform="uppercase">
            {title}
          </Heading>
          {subtitle && (
            <Text color="text.muted" fontWeight="medium">
              {subtitle}
            </Text>
          )}
        </VStack>
        <VStack as="ul" align="flex-start" gap={2} pl={5} listStyleType="disc">
          {bullets.map((b, i) => (
            <Text as="li" key={i} color="text.onPage">
              {b}
            </Text>
          ))}
        </VStack>
      </VStack>
    </HStack>
  );
}

export default function Steps({ heading, items }: StepsProps) {
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
      <SimpleGrid
        columns={{ base: 1, md: items.length >= 3 ? 3 : items.length }}
        gap={10}
        alignItems="start"
        w="full"
      >
        {items.map((item) => (
          <Step key={item.number} {...item} />
        ))}
      </SimpleGrid>
    </VStack>
  );
}

