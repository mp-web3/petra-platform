import { ChakraProvider } from '@chakra-ui/react';
import { petraTheme } from './theme';

interface PetraUIProviderProps {
  children: React.ReactNode;
}

export function PetraUIProvider({ children }: PetraUIProviderProps) {
  return <ChakraProvider value={petraTheme}>{children}</ChakraProvider>;
}

