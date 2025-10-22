// Semantic color tokens
export const semanticTokens = {
    colors: {
        // Brand Colors - Semantic aliases
        primary: {
            default: { value: '{colors.flame.500}' },
            light: { value: '{colors.flame.100}' },
            dark: { value: '{colors.flame.800}' },
        },
        secondary: {
            default: { value: '{colors.casal.500}' },
            light: { value: '{colors.casal.100}' },
            dark: { value: '{colors.casal.800}' },
        },
        neutralLight: {
            default: { value: '{colors.springWood.500}' },
            light: { value: '{colors.springWood.100}' },
            dark: { value: '{colors.springWood.800}' },
        },
        neutralDark: {
            default: { value: '{colors.codGray.500}' },
            light: { value: '{colors.codGray.100}' },
            dark: { value: '{colors.codGray.800}' },
        },

        // Surface Colors - Different background contexts
        surface: {
            action: { value: '{colors.primary.default}' },
            dark: { value: '{colors.secondary.dark}' },
            page: { value: '{colors.springWood.100}' },
            card: {
                red: { value: '{colors.primary.default}' },
                dark: { value: '{colors.secondary.dark}' },
                light: { value: '{colors.copperCanyon.400}' },
            },
            modal: { value: '{colors.white}' },
            elevated: { value: '{colors.springWood.200}' },
        },

        // Text Colors - Different text contexts
        text: {
            onPage: { value: '{colors.neutralDark.default}' },
            onSurfaceAction: { value: '{colors.neutralLight.default}' },
            onPrimary: { value: '{colors.neutralLight.default}' },
            onDark: { value: '{colors.neutralLight.default}' },
            onLight: { value: '{colors.neutralDark.default}' },
            onDefaultHoverlay: { value: '{colors.neutralLight.default}' },
            primary: { value: '{colors.casal.800}' },
            secondary: { value: '{colors.casal.600}' },
            muted: { value: '{colors.codGray.400}' },
            inverse: { value: '{colors.white}' },
            link: { value: '{colors.primary}' },
            linkHover: { value: '{colors.flame.600}' },
        },

        heading: {
            onPage: { value: '{colors.primary.default}' },
            onDark: { value: '{colors.neutralLight.default}' },
        },

        hoverlay: {
            default: { value: '{colors.blackAlpha.500}' },
        },

        // Border Colors - Different border contexts
        border: {
            default: { value: '{colors.neutralDark.default}' },
            subtle: { value: '{colors.neutralDark.light}' },
            strong: { value: '{colors.casal.400}' },
            focus: { value: '{colors.primary.default}' },
        },

        // Interactive Colors - Button and interactive states
        interactive: {
            primary: { value: '{colors.primary}' },
            primaryHover: { value: '{colors.flame.600}' },
            secondary: { value: '{colors.secondary}' },
            secondaryHover: { value: '{colors.casal.600}' },
            ghost: { value: 'transparent' },
            ghostHover: { value: '{colors.springWood.200}' },
        },

        // Status Colors - Different states and feedback
        status: {
            success: { value: '{colors.green.500}' },
            successLight: { value: '{colors.green.100}' },
            warning: { value: '{colors.yellow.500}' },
            warningLight: { value: '{colors.yellow.100}' },
            error: { value: '{colors.primary}' },
            errorLight: { value: '{colors.primaryLight}' },
        },
    },
};

