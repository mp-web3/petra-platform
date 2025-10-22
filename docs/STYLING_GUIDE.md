# 🎨 Petra Platform Styling Guide

## Overview

Due to compatibility issues between **Chakra UI v3** and **Next.js 16 with Turbopack**, we're using Chakra's default theme system with **CSS variables** to apply our custom Petra brand styling.

This approach gives us:
- ✅ Full brand consistency
- ✅ Stable, production-ready code
- ✅ Easy to maintain and update
- ✅ Same visual appearance as the original site

---

## 🎯 How It Works

### 1. **CSS Variables (globals.css)**

All Petra brand colors are defined as CSS variables in `/apps/web-marketing/src/app/globals.css`:

```css
:root {
  /* Primary Brand Color */
  --chakra-colors-brand-500: #f88b4b;
  --chakra-colors-brand-600: #c66f3c;
  
  /* Accent Colors */
  --chakra-colors-accent-orange: #ff7a59;
  --chakra-colors-accent-pink: #ff6b9d;
  
  /* And more... */
}
```

### 2. **Brand Tokens (brandTokens)**

For easier access in components, we export `brandTokens` from `@petra/ui`:

```typescript
import { brandTokens } from '@petra/ui';

// Usage in components:
<Box bg={brandTokens.primary}>
<Text color={brandTokens.text.secondary}>
<Button bg={brandTokens.primary} _hover={{ bg: brandTokens.primaryHover }}>
```

### 3. **Pre-built Brand Components**

Use these components for common patterns:

- `<BrandButton>` - Button with Petra brand styling
- `<MainButton>` - CTA button (already updated)

---

## 📖 Usage Examples

### Basic Component Styling

```tsx
import { Box, Text, Button, brandTokens } from '@petra/ui';

function MyComponent() {
  return (
    <Box 
      bg={brandTokens.bg.surface} 
      borderColor={brandTokens.border.default}
      p={6}
    >
      <Text 
        color={brandTokens.text.primary}
        fontFamily={brandTokens.fonts.heading}
        fontSize="2xl"
      >
        Title
      </Text>
      
      <Button
        bg={brandTokens.primary}
        color="white"
        _hover={{ bg: brandTokens.primaryHover }}
      >
        Click Me
      </Button>
    </Box>
  );
}
```

### Using the BrandButton Component

```tsx
import { BrandButton } from '@/components/BrandButton';

function MyComponent() {
  return (
    <>
      {/* Primary button (default) */}
      <BrandButton onClick={() => {}}>
        Get Started
      </BrandButton>
      
      {/* Secondary button */}
      <BrandButton variant="secondary">
        Learn More
      </BrandButton>
      
      {/* Outline button */}
      <BrandButton variant="outline">
        Contact Us
      </BrandButton>
    </>
  );
}
```

### Using Accent Colors

```tsx
import { Box, Heading, brandTokens } from '@petra/ui';

function FeatureCard() {
  return (
    <Box
      bg={brandTokens.accent.orange}
      borderRadius={brandTokens.radii.card}
      p={6}
    >
      <Heading color="white">
        Feature Title
      </Heading>
    </Box>
  );
}
```

---

## 🎨 Available Brand Tokens

### Colors

```typescript
brandTokens.primary              // #f88b4b (main brand color)
brandTokens.primaryHover         // Hover state
brandTokens.primaryActive        // Active/pressed state

// Accent colors
brandTokens.accent.orange
brandTokens.accent.pink
brandTokens.accent.purple
brandTokens.accent.blue
brandTokens.accent.teal
brandTokens.accent.green

// Text colors
brandTokens.text.primary         // Main text
brandTokens.text.secondary       // Secondary text
brandTokens.text.tertiary        // Tertiary/muted text
brandTokens.text.inverse         // Text on dark backgrounds

// Background colors
brandTokens.bg.canvas            // Page background
brandTokens.bg.surface           // Card/surface background
brandTokens.bg.muted             // Muted background
brandTokens.bg.overlay           // Modal overlay

// Border colors
brandTokens.border.default
brandTokens.border.subtle
brandTokens.border.emphasized
```

### Typography

```typescript
brandTokens.fonts.heading        // Montserrat
brandTokens.fonts.body           // Inter
```

### Spacing & Layout

```typescript
brandTokens.spacing.section      // 80px
brandTokens.spacing.container    // 1200px
brandTokens.radii.card           // 16px
brandTokens.radii.button         // 8px
```

---

## 🔄 Migrating Existing Components

### Before (with custom theme)

```tsx
<Button colorScheme="brand">Click Me</Button>
```

### After (with brand tokens)

```tsx
<Button 
  bg={brandTokens.primary}
  color="white"
  _hover={{ bg: brandTokens.primaryHover }}
>
  Click Me
</Button>
```

### Or use the BrandButton

```tsx
<BrandButton>Click Me</BrandButton>
```

---

## 🆕 Creating New Brand Components

When creating reusable components, follow this pattern:

```tsx
// components/BrandCard.tsx
import { Box, type BoxProps, brandTokens } from '@petra/ui';

export function BrandCard({ children, ...props }: BoxProps) {
  return (
    <Box
      bg={brandTokens.bg.surface}
      borderRadius={brandTokens.radii.card}
      borderWidth="1px"
      borderColor={brandTokens.border.default}
      p={6}
      _hover={{
        borderColor: brandTokens.primary,
        boxShadow: 'md',
      }}
      transition="all 0.2s"
      {...props}
    >
      {children}
    </Box>
  );
}
```

---

## 📝 Best Practices

1. **Use `brandTokens` instead of hardcoded colors**
   - ❌ Bad: `bg="#f88b4b"`
   - ✅ Good: `bg={brandTokens.primary}`

2. **Use the pre-built components when possible**
   - `<BrandButton>` instead of custom `<Button>`
   - `<MainButton>` for CTAs

3. **Keep styling consistent**
   - Use the same hover/active states
   - Use the same border radius values
   - Use the same spacing patterns

4. **Add new tokens when needed**
   - If you need a new color combination, add it to `brand-tokens.ts`
   - Don't hardcode values in components

---

## 🔮 Future: Custom Theme Migration

When Chakra UI v3 + Next.js 16 compatibility improves (or we downgrade to Next.js 15), we can migrate back to the full custom theme system. The CSS variables approach makes this easy:

1. The colors are already defined
2. Components use brand tokens, not hardcoded values
3. Migration will be a simple find-and-replace

---

## 🐛 Troubleshooting

### Colors not showing?

Make sure `globals.css` is imported in your layout:

```tsx
// app/layout.tsx
import './globals.css';
```

### Brand tokens not found?

Rebuild the UI package:

```bash
pnpm --filter @petra/ui build
```

### Still looks wrong?

Check that you're using the brand tokens correctly:

```tsx
// ❌ This won't work
<Button colorScheme="brand">

// ✅ This will work
<Button bg={brandTokens.primary} color="white">
```

---

## 📚 Additional Resources

- [Chakra UI Documentation](https://chakra-ui.com/)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Brand Tokens Source](/packages/ui/src/brand-tokens.ts)
- [Example Component](/apps/web-marketing/src/components/BrandButton.tsx)

