'use client';

import { Box, Text } from '@chakra-ui/react';

export default function TestPage() {
  return (
    <Box p={8} bg="red.500">
      <Text color="white" fontSize="2xl">
        Test Page - If you see this styled, Chakra is working!
      </Text>
    </Box>
  );
}

