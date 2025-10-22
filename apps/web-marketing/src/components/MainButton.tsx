'use client';

import Link from 'next/link';
import { Button } from '@chakra-ui/react';

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
      bg="flame.500"
      color="white"
      fontFamily="button"
      fontWeight="medium"
      textStyle="button"
      px={8}
      py={4}
      borderRadius="full"
      _hover={{ 
        bg: "flame.600",
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
      }}
      _active={{
        bg: "flame.700",
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

