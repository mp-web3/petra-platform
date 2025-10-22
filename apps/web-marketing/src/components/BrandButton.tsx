/**
 * BrandButton - A button component styled with Petra brand colors
 * Example of how to create brand-styled components using Chakra's default theme
 */

import { Button, type ButtonProps } from '@petra/ui';
import { brandTokens } from '@petra/ui';

interface BrandButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
}

export function BrandButton({ variant = 'primary', children, ...props }: BrandButtonProps) {
  const variantStyles = {
    primary: {
      bg: brandTokens.primary,
      color: 'white',
      _hover: {
        bg: brandTokens.primaryHover,
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
      },
      _active: {
        bg: brandTokens.primaryActive,
        transform: 'translateY(0)',
      },
    },
    secondary: {
      bg: 'transparent',
      color: brandTokens.primary,
      borderColor: brandTokens.primary,
      borderWidth: '2px',
      _hover: {
        bg: 'var(--chakra-colors-brand-50)',
      },
    },
    outline: {
      variant: 'outline',
      borderColor: brandTokens.primary,
      color: brandTokens.primary,
      _hover: {
        bg: 'var(--chakra-colors-brand-50)',
      },
    },
  };

  return (
    <Button
      borderRadius={brandTokens.radii.button}
      fontFamily={brandTokens.fonts.heading}
      fontWeight="600"
      px={8}
      py={6}
      transition="all 0.2s"
      {...variantStyles[variant]}
      {...props}
    >
      {children}
    </Button>
  );
}

