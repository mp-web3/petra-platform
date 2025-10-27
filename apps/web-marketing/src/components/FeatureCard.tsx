import { Heading, Image, Text, VStack } from '@chakra-ui/react';

export interface FeatureCardProps {
  iconSrc: string;
  iconAlt: string;
  title: string;
  description: string;
  variant?: 'light' | 'dark';
  align?: 'left' | 'center';
  rounded?: 'none' | 'md' | 'lg';
  hasCardBorder?: boolean;
}

export default function FeatureCard({
  iconSrc,
  iconAlt,
  title,
  description,
  variant = 'light',
  align = 'center',
  rounded = 'lg',
  hasCardBorder = false,
}: FeatureCardProps) {
  const isDark = variant === 'dark';
  const bg = hasCardBorder
    ? isDark
      ? 'neutralDark.dark'
      : 'neutralLight.default'
    : 'transparent';
  const textColor = isDark ? 'text.onDark' : 'text.onPage';

  return (
    <VStack
      align={align === 'left' ? 'flex-start' : 'center'}
      textAlign={align === 'left' ? 'left' : 'center'}
      gap={4}
      bg={bg}
      color={textColor}
      p={hasCardBorder ? 6 : 0}
      borderRadius={rounded}
      border={hasCardBorder ? '1px solid' : undefined}
      borderColor={hasCardBorder ? 'border.subtle' : undefined}
    >
      <Image src={iconSrc} alt={iconAlt} boxSize={[12, 14]} />
      <Heading as="h3" textStyle="h4">
        {title}
      </Heading>
      <Text maxW={{ md: 'sm' }} color={textColor}>
        {description}
      </Text>
    </VStack>
  );
}

