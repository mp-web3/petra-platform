import Image from 'next/image';
import { Box, Heading, Text, VStack, Accordion, HStack } from '@chakra-ui/react';
import { LuChevronDown } from 'react-icons/lu';

export interface FAQItem {
  q: string;
  a: string;
}

interface FAQsSectionProps {
  heading: string;
  highlight: string;
  subheading?: string;
  items: FAQItem[];
}

export default function FAQsSection({
  heading,
  highlight,
  subheading,
  items,
}: FAQsSectionProps) {
  return (
    <Box bg="surface.page" color="text.onPage" px={[4, 6, 8]} py={[16, 20, 24]}>
      <VStack gap={6} maxW="container.xl" mx="auto" textAlign="center">
        <Box
          border="2px solid"
          borderColor="border.focus"
          borderRadius="full"
          bg="primary.light"
          p={3}
        >
          <Image
            src="/icons/question_mark_primary.svg"
            alt="question mark icon"
            width={56}
            height={56}
          />
        </Box>
        <Heading as="h2" textStyle="h2">
          {heading} <Text as="span" color="primary.default">{highlight}</Text>
        </Heading>
        {subheading && (
          <Text textStyle="subHeader" color="text.muted">
            {subheading}
          </Text>
        )}

        <Accordion.Root collapsible>
          {items.map((f, i) => (
            <Accordion.Item
              key={i}
              value={`item-${i}`}
              bg="neutralLight.default"
              borderRadius="md"
              mb={4}
              border="1px solid"
              borderColor="border.subtle"
            >
              <Accordion.ItemTrigger asChild>
                <Box
                  as="button"
                  w="full"
                  textAlign="left"
                  px={6}
                  py={4}
                  _hover={{ bg: 'neutralLight.light' }}
                  borderRadius="md"
                >
                  <HStack justify="space-between" align="center" w="full">
                    <Text fontWeight="semibold">{f.q}</Text>
                    <Accordion.ItemIndicator>
                      <LuChevronDown />
                    </Accordion.ItemIndicator>
                  </HStack>
                </Box>
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Box px={6} py={4} textAlign="left">
                  <Text whiteSpace="pre-line">{f.a}</Text>
                </Box>
              </Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </VStack>
    </Box>
  );
}

