import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { colors } from './colors';
import { semanticTokens } from './semantic-colors';
import { typography } from './typography';
import { textStyles } from './text-styles';

const config = defineConfig({
  theme: {
    tokens: {
      colors,
      ...typography,
    },
    semanticTokens: {
      ...semanticTokens,
    },
    textStyles,
  },
});

export const system = createSystem(defaultConfig, config);

// Export individual tokens for reference
export { colors, semanticTokens, typography, textStyles };

