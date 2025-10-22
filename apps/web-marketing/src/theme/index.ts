// src/theme/index.ts
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"
import { colors } from './colors'
import { semanticTokens } from './colorsSemantic'
import { typography } from './typography'
import { textStyles } from './text-styles'

const config = defineConfig({
    theme: {
        tokens: {
            colors,
            ...typography
        },
        semanticTokens: {
            ...semanticTokens,
        },
        textStyles,
    }
})

export default createSystem(defaultConfig, config)
