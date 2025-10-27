'use client';

import { Box, Container, SimpleGrid, VStack, HStack, Text, Button, Image } from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

export type Testimonial = {
  id: string;
  quote: string;
  author?: string;
  role?: string;
  avatarUrl?: string;
};

interface TestimonialsProps {
  items: Testimonial[];
}

export default function Testimonials({ items }: TestimonialsProps) {
  const visibleCount = useBreakpointValue({ base: 1, md: 3 }) || 1;
  const [startIndex, setStartIndex] = useState<number>(0);

  const total = items.length;

  const visibleItems = useMemo(() => {
    return Array.from({ length: Math.min(visibleCount, total) }).map((_, i) => {
      const idx = (startIndex + i) % total;
      return items[idx];
    });
  }, [items, startIndex, total, visibleCount]);

  const goPrev = () => setStartIndex((prev) => (prev - 1 + total) % total);
  const goNext = () => setStartIndex((prev) => (prev + 1) % total);

  if (total === 0) return null;

  return (
    <Box bg="surface.page" py={[10, 14]}>
      <Container maxW="container.xl">
        <HStack align="center" gap={4} w="full">
          <Button variant="ghost" onClick={goPrev} aria-label="Precedente">
            ‹
          </Button>

          <SimpleGrid flex="1" columns={{ base: 1, md: 3 }} gap={[6, 8, 10]}>
            {visibleItems.map((t) => (
              <VStack
                key={t.id}
                align="center"
                textAlign="center"
                bg="transparent"
                p={[2, 4]}
                gap={4}
              >
                {/* Circular avatar */}
                {t.avatarUrl ? (
                  <Image
                    src={t.avatarUrl}
                    alt={t.author || 'testimonial avatar'}
                    boxSize={{ base: '200px', md: '300px' }}
                    borderRadius="full"
                    objectFit="fit"
                    border="2px solid"
                    borderColor="black"
                  />
                ) : null}

                {/* Quote */}
                <Text textStyle="md" color="text.onPage" fontStyle="italic">
                  {t.quote}
                </Text>

                {t.author || t.role ? (
                  <Box>
                    {t.author ? (
                      <Text textStyle="sm" color="text.primary" fontWeight="semibold">
                        {t.author}
                      </Text>
                    ) : null}
                    {t.role ? (
                      <Text textStyle="sm" color="text.secondary">
                        {t.role}
                      </Text>
                    ) : null}
                  </Box>
                ) : null}
              </VStack>
            ))}
          </SimpleGrid>

          <Button variant="ghost" onClick={goNext} aria-label="Successivo">
            ›
          </Button>
        </HStack>
      </Container>
    </Box>
  );
}

