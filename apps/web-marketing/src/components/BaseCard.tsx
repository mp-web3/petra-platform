import Link from 'next/link';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

interface BaseCardProps {
  heading: string;
  description: string;
  link: string;
  backgroundColor: string;
  headingColor: string;
  descriptionColor: string;
}

export default function BaseCard({
  heading,
  description,
  link,
  backgroundColor,
  headingColor,
  descriptionColor,
}: BaseCardProps) {
  return (
    <Link href={link}>
      <Box
        display="flex"
        aspectRatio={1 / 1}
        bg={backgroundColor}
        px={[4, 6, 8]}
        w="100%"
        borderRadius="4px"
        maxW={['375px', '600px']}
        transition="transform 0.2s"
        _hover={{ transform: 'scale(1.02)' }}
      >
        <VStack align="center" justify="center" gap={6}>
          <Heading as="h3" textStyle="h3" color={headingColor}>
            {heading}
          </Heading>
          <Text color={descriptionColor} textAlign="center">
            {description}
          </Text>
        </VStack>
      </Box>
    </Link>
  );
}

