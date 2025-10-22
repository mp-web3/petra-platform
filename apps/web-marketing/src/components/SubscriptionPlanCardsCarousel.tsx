'use client';

import { Box, HStack, IconButton } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import SubscriptionPlanCard from './SubscriptionPlanCard';
import type { SubscriptionPlanCardProps } from './SubscriptionPlanCard';

export interface SubscriptionPlanCardsSliderProps {
  plans: SubscriptionPlanCardProps[];
}

export default function SubscriptionPlanCardsSlider({
  plans,
}: SubscriptionPlanCardsSliderProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  const page = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth;
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setIndex(Math.max(0, Math.min(plans.length - 1, i)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [plans.length]);

  return (
    <Box position="relative" w="full">
      <HStack
        position="absolute"
        top={2}
        left={0}
        right={0}
        px={[2, 4]}
        justify="center"
        zIndex={1}
        display={{ base: 'flex', md: 'none' }}
      >
        <IconButton aria-label="Previous" variant="ghost" onClick={() => page(-1)}>
          <LuChevronLeft />
        </IconButton>
        <HStack gap={2}>
          {plans.map((_, i) => (
            <Box
              key={i}
              w={2}
              h={2}
              borderRadius="full"
              bg={i === index ? 'primary.default' : 'neutralDark.default'}
            />
          ))}
        </HStack>
        <IconButton aria-label="Next" variant="ghost" onClick={() => page(1)}>
          <LuChevronRight />
        </IconButton>
      </HStack>

      <Box
        ref={scrollerRef}
        overflowX={{ base: 'auto', md: 'hidden' }}
        display="flex"
        w="100%"
        gap={4}
        px={4}
        pt={12}
        pb={[2, 4]}
        scrollSnapType={{ base: 'x mandatory', md: 'none' }}
        css={{
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollPaddingInline: '16px',
          overscrollBehaviorX: 'contain',
        }}
        justifyContent={{ base: 'unset', md: 'center' }}
      >
        {plans.map((p, idx) => (
          <SubscriptionPlanCard key={`${p.title}-${idx}`} {...p} />
        ))}
      </Box>
    </Box>
  );
}

