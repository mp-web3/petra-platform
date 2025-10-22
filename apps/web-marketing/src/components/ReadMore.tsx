'use client';

import { Text } from '@chakra-ui/react';
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
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          marginLeft: '0.5rem',
          color: 'var(--chakra-colors-primary-default)',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
        }}
      >
        {expanded ? lessLabel : moreLabel}
      </button>
    </Text>
  );
}

