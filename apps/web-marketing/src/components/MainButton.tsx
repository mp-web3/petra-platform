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
      bg="surface.action"
      color="text.onSurfaceAction"
      textStyle="button"
      px={8}
      py={4}
      borderRadius="md"
      _hover={{ bg: 'interactive.primaryHover' }}
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

