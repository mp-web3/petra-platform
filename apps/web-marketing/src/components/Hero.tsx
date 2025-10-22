import { Box, Container, VStack, Heading, Text } from '@petra/ui';
import MainButton from './MainButton';

interface HeroProps {
  backgroundImage: string;
  titleLine1: string;
  titleLine2?: string;
  buttonText: string;
  buttonOnClick?: () => void;
  buttonHref?: string;
  objectionReducingInfoText: string;
}

export default function Hero({
  backgroundImage,
  titleLine1,
  titleLine2,
  buttonText,
  buttonOnClick,
  buttonHref,
  objectionReducingInfoText,
}: HeroProps) {
  return (
    <Box minH="100vh" position="relative">
      {/* Background Image */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundImage={`url('${backgroundImage}')`}
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        zIndex={1}
      />

      {/* Dark Overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="hoverlay.default"
        zIndex={2}
      />

      {/* Content */}
      <Container
        position="relative"
        zIndex={3}
        maxW="container.xl"
        px={[4, 6, 8]}
        h="100vh"
        display="flex"
        alignItems="center"
      >
        <VStack align="flex-start" gap={[6, 8, 10]} pr={[6, 6, 8]} maxW="2xl">
          {/* Main Heading */}
          <Heading
            as="h1"
            textStyle="h1"
            color="text.onDefaultHoverlay"
            whiteSpace="pre-line"
          >
            {titleLine1}
            {titleLine2 ? (
              <>
                <br />
                {titleLine2}
              </>
            ) : null}
          </Heading>

          {/* Call-to-Action Button */}
          <MainButton text={buttonText} onClick={buttonOnClick} href={buttonHref} />

          {/* Objection Reducing Info Text */}
          <Text textStyle="objectionReducing" color="text.onDefaultHoverlay">
            {objectionReducingInfoText}
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}

