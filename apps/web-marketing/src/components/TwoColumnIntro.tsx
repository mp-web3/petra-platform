import { Heading, SimpleGrid, Text, VStack, Container } from '@chakra-ui/react';
import MainButton from './MainButton';

interface TwoColumnIntroProps {
  heading: string | React.ReactNode;
  text: string;
  buttonText: string;
  buttonHref: string;
  reverse?: boolean;
  variant?: 'light' | 'dark';
}

export default function TwoColumnIntro({
  heading,
  text,
  buttonText,
  buttonHref,
  reverse = false,
  variant = 'light',
}: TwoColumnIntroProps) {
  const isDark = variant === 'dark';
  const bg = isDark ? 'surface.dark' : 'surface.page';
  const textColor = isDark ? 'text.onDark' : 'text.onPage';
  
  return (
    <Container
      position="relative"
      zIndex={3}
      maxW="container.xl"
      px={[4, 6, 8]}
      py={[16, 20, 24]}
      h="auto"
      display="flex"
      alignItems="center"
      bg={bg}
    >
      <SimpleGrid
        columns={{ base: 1, md: 1 }}
        gap={[4, 4, 8]}
        alignItems="stretch"
        justifyItems="flex-start"
        w="100%"
      >
        <Heading
          as="h2"
          textStyle="h2"
          color="heading.onPage"
          whiteSpace="pre-line"
          order={{ base: 0, md: reverse ? 1 : 0 }}
        >
          {heading}
        </Heading>
        <VStack
          align="flex-start"
          justify="center"
          gap={[4, 4, 8]}
          order={{ base: 1, md: reverse ? 0 : 1 }}
        >
          <Text textStyle="md" color={textColor} whiteSpace="pre-line">
            {text}
          </Text>
          <MainButton text={buttonText} href={buttonHref} />
        </VStack>
      </SimpleGrid>
    </Container>
  );
}

