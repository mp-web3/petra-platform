import Image from 'next/image';
import { Box, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';

interface SectionWithImageAndTextProps {
  heading: string;
  imageUrl: string;
  imageAlt?: string;
  text: string;
  width?: number;
  height?: number;
}

export default function SectionWithImageAndText({
  heading,
  imageUrl,
  imageAlt = '',
  text,
  width = 650,
  height = 650,
}: SectionWithImageAndTextProps) {
  return (
    <Box>
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        gap={[11, 6, 8]}
        px={[4, 6, 8]}
        py={[16, 20, 24]}
        mx="auto"
        alignItems="stretch"
        justifyItems={{ base: 'flex-start', md: 'center' }}
        w="100%"
      >
        <VStack align={{ base: 'flex-start' }} gap={[4, 4, 8]}>
          <Heading as="h2" textStyle="h2" color="text.onPage" lineHeight={1}>
            {heading}
          </Heading>
          <Text textStyle="sm" color="text.onPage">
            {text}
          </Text>
        </VStack>
        <Box position="relative" w="full" maxW={{ md: `${width}px` }}>
          <Image
            src={imageUrl}
            alt={imageAlt || heading}
            width={width}
            height={height}
            style={{ width: '100%', height: 'auto' }}
          />
        </Box>
      </SimpleGrid>
    </Box>
  );
}

