# @petra/web-coaching - Coaching Platform

Next.js application for the Petra online coaching platform. This is where clients access their personalized training programs, nutrition plans, and communicate with coaches.

## 🚀 Getting Started

### Development

```bash
# From monorepo root
pnpm --filter @petra/web-coaching dev

# Or from this directory
pnpm dev
```

Visit [http://localhost:3002](http://localhost:3002)

### Build

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication routes (login, register)
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── dashboard/       # Main dashboard
│   │   ├── workouts/        # Workout management
│   │   ├── nutrition/       # Nutrition plans
│   │   ├── progress/        # Progress tracking
│   │   ├── chat/            # Coach communication
│   │   └── settings/        # User settings
│   ├── layout.tsx           # Root layout with Chakra UI
│   └── page.tsx             # Landing page
├── components/              # React components
├── lib/                     # Utilities and helpers
└── styles/                  # Global styles
```

## 🎨 Features

- 🔐 **Authentication**: Login, register, password reset
- 📊 **Dashboard**: Personalized client dashboard
- 🏋️ **Workouts**: View and track workout programs
- 🥗 **Nutrition**: Access nutrition plans and meal guides
- 📈 **Progress**: Track measurements, photos, achievements
- 💬 **Chat**: Real-time communication with coach
- ⚙️ **Settings**: Profile management, preferences

## 🔧 Technology

- **Framework**: Next.js 16 (App Router)
- **UI**: Chakra UI (@petra/ui)
- **API Client**: @petra/api-client
- **Types**: @petra/types
- **Styling**: Chakra UI + CSS

## 🌐 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

## 📦 Shared Packages

This app uses shared packages from the monorepo:

- `@petra/ui` - Chakra UI theme and components
- `@petra/api-client` - Type-safe API client
- `@petra/types` - Shared TypeScript types
- `@petra/utils` - Shared utilities

## 🚢 Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Set root directory to `apps/web-coaching`
3. Set environment variables
4. Deploy

### Docker

```bash
docker build -t petra-web-coaching -f apps/web-coaching/Dockerfile .
docker run -p 3002:3002 petra-web-coaching
```

## 🔒 Authentication Flow

1. User visits `/login` or `/register`
2. Credentials sent to API
3. JWT token stored in localStorage
4. Protected routes check for valid token
5. Redirect to `/login` if unauthorized

## 📱 Future Features

- [ ] Mobile app (React Native)
- [ ] Offline support (PWA)
- [ ] Push notifications
- [ ] Video calls with coach
- [ ] Social features (community, leaderboard)
- [ ] Wearable integrations (Apple Health, Google Fit)

