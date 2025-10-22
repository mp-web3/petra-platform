# @petra/web-marketing - Marketing Website

Public-facing marketing website for Petra Online Coaching. Showcases coaching programs, pricing, testimonials, and handles subscription checkouts.

## 🚀 Getting Started

### Development

```bash
# From monorepo root
pnpm --filter @petra/web-marketing dev

# Or from this directory
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Build

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Home page
│   ├── about/                    # About page
│   ├── plans/                    # Pricing plans
│   ├── coaching-donna/           # Coaching for women
│   ├── coaching-uomo/            # Coaching for men (future)
│   ├── checkout/                 # Checkout flow
│   │   ├── success/              # Success page
│   │   └── cancel/               # Cancel page
│   ├── privacy/                  # Privacy policy
│   ├── terms/                    # Terms of service
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── PlanCard.tsx
│   └── Testimonials.tsx
└── lib/                          # Utilities
```

## 🎨 Features

- 🏠 **Landing Page**: Hero section, features, social proof
- 💰 **Pricing Plans**: Woman & Man starter/premium plans
- 🛒 **Checkout**: Stripe checkout integration
- 📄 **Static Pages**: About, Terms, Privacy
- 📱 **Responsive**: Mobile-first design
- ⚡ **Optimized**: Static generation where possible

## 🔧 Technology

- **Framework**: Next.js 16 (App Router)
- **UI**: Chakra UI (@chakra-ui/react)
- **API Client**: @petra/api-client
- **Types**: @petra/types
- **Payments**: Stripe Checkout

## 🌐 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 📦 Migrating from petra-website

This app will replace the Vite-based petra-website. To migrate:

1. Copy components from `petra-website/src/components/` to `src/components/`
2. Convert React Router routes to Next.js App Router pages
3. Update imports to use `@chakra-ui/react` package
4. Move assets to `public/` directory
5. Test all pages and functionality

### Migration Checklist

- [ ] Copy all components
- [ ] Migrate pages: Home, About, Plans, Coaching
- [ ] Copy assets (images, icons, fonts)
- [ ] Update Stripe integration
- [ ] Test checkout flow
- [ ] Update SEO metadata
- [ ] Configure redirects
- [ ] Deploy to Vercel

## 🚢 Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Set root directory to `apps/web-marketing`
3. Set environment variables
4. Deploy

### Static Export

```bash
# Add to next.config.ts: output: 'export'
pnpm build

# Deploy dist/ to any static host
```

## 🎯 SEO

- Use Next.js `metadata` API for SEO
- Generate `sitemap.xml` and `robots.txt`
- Optimize images with `next/image`
- Use semantic HTML
- Add structured data (JSON-LD)

## 📊 Analytics

Consider adding:
- Google Analytics
- Facebook Pixel
- Hotjar / Microsoft Clarity
- Vercel Analytics

## 🔄 Content Management

For easy content updates, consider:
- Markdown files in `content/` directory
- Headless CMS (Contentful, Sanity)
- Prismic
- Strapi

