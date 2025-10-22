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

export const petraTheme = createSystem(defaultConfig, config);

export { colors, semanticTokens, typography, textStyles };

