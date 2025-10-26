'use client';

import { Link, Text } from '@chakra-ui/react';
import React from 'react';

interface ReadMoreProps {
  text: string;
  truncateAt: string;
  moreLabel?: string;
  lessLabel?: string;
  textProps?: React.ComponentProps<typeof Text>;
}

export default function ReadMore({
  text,
  truncateAt,
  moreLabel = 'leggi di più',
  lessLabel = 'mostra meno',
  textProps,
}: ReadMoreProps) {
  const [expanded, setExpanded] = React.useState(false);

  const splitIndex = text.indexOf(truncateAt);
  const hasSplit = splitIndex !== -1;
  const head = hasSplit ? text.slice(0, splitIndex) : text;
  const tail = hasSplit ? text.slice(splitIndex) : '';

  if (!hasSplit) {
    return <Text {...textProps}>{text}</Text>;
  }

  return (
    <Text {...textProps}>
      {head}
      {!expanded && '... '}
      {expanded && tail}
      <Link
        as="button"
        color="primary.default"
        onClick={() => setExpanded((v) => !v)}
        ml={2}
        _hover={{ color: 'interactive.primaryHover' }}
      >
        {expanded ? lessLabel : moreLabel}
      </Link>
    </Text>
  );
}

