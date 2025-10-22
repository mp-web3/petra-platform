import Link from 'next/link';
import { Button, brandTokens } from '@petra/ui';

interface MainButtonProps {
  text?: string;
  href?: string;
  onClick?: () => void;
  isExternal?: boolean;
}

export default function MainButton({ text, href, onClick, isExternal }: MainButtonProps) {
  const buttonEl = (
    <Button
      onClick={onClick}
      bg={brandTokens.primary}
      color="white"
      fontFamily={brandTokens.fonts.heading}
      fontWeight="600"
      px={8}
      py={4}
      borderRadius={brandTokens.radii.button}
      _hover={{ 
        bg: brandTokens.primaryHover,
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
      }}
      _active={{
        bg: brandTokens.primaryActive,
        transform: 'translateY(0)',
      }}
      transition="all 0.2s"
      w={{ base: 'auto', md: 'auto' }}
    >
      {text}
    </Button>
  );

  if (href) {
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {buttonEl}
        </a>
      );
    }
    return <Link href={href}>{buttonEl}</Link>;
  }

  return buttonEl;
}

