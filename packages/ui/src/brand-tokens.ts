/**
 * Brand Design Tokens
 * Use these throughout your components for consistent styling
 */

export const brandTokens = {
  // Primary brand color
  primary: 'var(--chakra-colors-brand-500)',
  primaryHover: 'var(--chakra-colors-brand-600)',
  primaryActive: 'var(--chakra-colors-brand-700)',

  // Accent colors
  accent: {
    orange: 'var(--chakra-colors-accent-orange)',
    pink: 'var(--chakra-colors-accent-pink)',
    purple: 'var(--chakra-colors-accent-purple)',
    blue: 'var(--chakra-colors-accent-blue)',
    teal: 'var(--chakra-colors-accent-teal)',
    green: 'var(--chakra-colors-accent-green)',
  },

  // Text colors
  text: {
    primary: 'var(--chakra-colors-text-primary)',
    secondary: 'var(--chakra-colors-text-secondary)',
    tertiary: 'var(--chakra-colors-text-tertiary)',
    inverse: 'var(--chakra-colors-text-inverse)',
  },

  // Background colors
  bg: {
    canvas: 'var(--chakra-colors-bg-canvas)',
    surface: 'var(--chakra-colors-bg-surface)',
    muted: 'var(--chakra-colors-bg-muted)',
    overlay: 'var(--chakra-colors-bg-overlay)',
  },

  // Border colors
  border: {
    default: 'var(--chakra-colors-border-default)',
    subtle: 'var(--chakra-colors-border-subtle)',
    emphasized: 'var(--chakra-colors-border-emphasized)',
  },

  // Fonts
  fonts: {
    heading: 'var(--font-heading)',
    body: 'var(--font-body)',
  },

  // Common component styles
  button: {
    primary: {
      bg: 'var(--chakra-colors-brand-500)',
      color: 'white',
      _hover: {
        bg: 'var(--chakra-colors-brand-600)',
      },
      _active: {
        bg: 'var(--chakra-colors-brand-700)',
      },
    },
    secondary: {
      bg: 'transparent',
      color: 'var(--chakra-colors-brand-500)',
      borderColor: 'var(--chakra-colors-brand-500)',
      borderWidth: '2px',
      _hover: {
        bg: 'var(--chakra-colors-brand-50)',
      },
    },
  },

  // Spacing shortcuts
  spacing: {
    section: '80px',
    container: '1200px',
  },

  // Border radius
  radii: {
    card: '16px',
    button: '8px',
  },
} as const;

export type BrandTokens = typeof brandTokens;

