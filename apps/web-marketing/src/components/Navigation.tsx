'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Box,
  Container,
  HStack,
  IconButton,
  Drawer,
  VStack,
  Text,
  CloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { LuMenu } from 'react-icons/lu';

export default function Navigation() {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <Box as="header" position="fixed" top={0} left={0} right={0} zIndex={99} bg="whiteAlpha.50">
      <Container maxW="container.xl" px={[4, 6, 8]} py={4}>
        <HStack justify="space-between" align="center">
          <Link href="/">
            <Image
              src="/logos/logo-2.png"
              alt="Petra Logo"
              width={150}
              height={50}
              priority
            />
          </Link>
          <IconButton
            aria-label="Apri menu"
            variant="ghost"
            color="white"
            onClick={onOpen}
            css={{ _icon: { width: '6', height: '6' } }}
          >
            <LuMenu />
          </IconButton>
        </HStack>
      </Container>

      <Drawer.Root
        placement="end"
        open={open}
        onOpenChange={(e) => (e.open ? onOpen() : onClose())}
        size={{ base: 'full', md: 'lg' }}
      >
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content bg="surface.page" color="text.primary">
            <Drawer.Body>
              <HStack justify="flex-end" w="full">
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="lg" />
                </Drawer.CloseTrigger>
              </HStack>
              <VStack align="flex-start" gap={8} mt={20}>
                <Link href="/" onClick={onClose}>
                  <Text fontSize={['3xl', '4xl', '5xl']} fontWeight="bold">
                    Home
                  </Text>
                </Link>
                <Link href="/about" onClick={onClose}>
                  <Text fontSize={['3xl', '4xl', '5xl']} fontWeight="bold">
                    About
                  </Text>
                </Link>
                <Link href="/coaching-donna-online" onClick={onClose}>
                  <Text fontSize={['3xl', '4xl', '5xl']} fontWeight="bold">
                    Coaching Donna
                  </Text>
                </Link>
              </VStack>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </Box>
  );
}

