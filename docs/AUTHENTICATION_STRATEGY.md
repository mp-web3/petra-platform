# 🔐 Authentication Strategy for Petra Platform

## The Question

Should users sign up BEFORE or AFTER purchasing a subscription?

## ✅ Recommended: Guest Checkout → Account Creation

**Allow guest checkout, create account automatically, send activation email.**

This is the modern e-commerce/SaaS pattern used by Stripe, Shopify, Notion, Linear, and most successful platforms.

---

## 🎯 Why This Approach?

### 1. **Higher Conversion Rate** 📈
- Requiring registration BEFORE purchase adds friction
- Users abandon carts when forced to create accounts
- Studies show 25-35% drop-off when registration is required first

### 2. **Better User Experience** ✨
- "I just want to buy" mindset
- Users can decide to purchase quickly
- No upfront commitment beyond payment

### 3. **Natural Flow** 🌊
```
Purchase → Payment Success → "Welcome! Claim Your Account" → Set Password → Full Access
```

Users are most motivated to complete setup AFTER they've committed financially.

---

## 🏗️ Implementation Flow

### Step 1: Guest Checkout (Current)

```typescript
// User fills form on checkout preview page
{
  email: "petra@gmail.com",
  tosAccepted: true,
  marketingOptIn: true
}
```

✅ **Already implemented!**

---

### Step 2: Payment → Auto-Create User

```typescript
// apps/api/src/stripe/stripe.controller.ts
@Post('webhook')
async handleWebhook(@Body() event: any) {
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // 1. Check if user already exists
    let user = await this.prisma.user.findUnique({
      where: { email: session.customer_email }
    });
    
    // 2. Create user if new (guest checkout)
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: session.customer_email,
          stripeCustomerId: session.customer,
          role: 'CLIENT',
          // No password yet - will be set later
          emailVerified: false
        }
      });
    }
    
    // 3. Create order
    const order = await this.prisma.order.create({
      data: {
        userId: user.id,
        amount: session.amount_total,
        status: 'COMPLETED',
        // ... other fields
      }
    });
    
    // 4. Send account activation email
    await this.emailService.sendAccountActivation(user.email, user.id);
  }
}
```

---

### Step 3: Send "Claim Your Account" Email

```typescript
// apps/api/src/email/email.service.ts
async sendAccountActivation(email: string, userId: string) {
  // Generate magic link token (expires in 7 days)
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  const activationLink = `${process.env.FRONTEND_URL}/activate-account?token=${token}`;
  
  await this.resend.emails.send({
    from: 'Petra Coaching <petra@yourdomain.com>',
    to: email,
    subject: '🎉 Benvenuta! Attiva il tuo account Petra',
    html: `
      <h1>Grazie per il tuo acquisto!</h1>
      <p>Il tuo pagamento è stato confermato. Ora è il momento di configurare il tuo account personale.</p>
      
      <h2>Next steps:</h2>
      <ol>
        <li>Clicca il link qui sotto per attivare il tuo account</li>
        <li>Crea una password sicura</li>
        <li>Prenota la tua consulenza iniziale</li>
        <li>Scarica l'app e inizia il tuo percorso!</li>
      </ol>
      
      <a href="${activationLink}" style="background: #FF6B9D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
        Attiva Account
      </a>
      
      <p><small>Questo link è valido per 7 giorni.</small></p>
      
      <p>Se non hai effettuato questo acquisto, ignora questa email.</p>
    `
  });
}
```

---

### Step 4: Account Activation Page

```typescript
// apps/web-coaching/src/app/activate-account/page.tsx
'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Button, Container, Heading, Input, Text, VStack } from '@chakra-ui/react';
import { apiClient } from '@/lib/api-client';

export default function ActivateAccountPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActivate = async () => {
    if (password !== confirmPassword) {
      setError('Le password non corrispondono');
      return;
    }
    
    if (password.length < 8) {
      setError('La password deve essere lunga almeno 8 caratteri');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiClient.post('/auth/activate', {
        token,
        password,
        name
      });

      // Redirect to login or dashboard
      router.push('/dashboard?welcome=true');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Errore durante l\'attivazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box pt={20} bg="surface.page" minH="100vh">
      <Container maxW="container.sm" px={[4, 6, 8]} py={[16, 20, 24]}>
        <VStack gap={6} align="stretch">
          <Heading as="h1" textStyle="h2" color="heading.onPage">
            Attiva il tuo account
          </Heading>
          
          <Text color="text.onPage">
            Completa la configurazione del tuo account per accedere alla piattaforma e iniziare il tuo percorso.
          </Text>

          {error && (
            <Box bg="red.100" color="red.800" p={4} borderRadius="md">
              {error}
            </Box>
          )}

          <VStack gap={4}>
            <Input
              placeholder="Il tuo nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="lg"
            />
            
            <Input
              type="password"
              placeholder="Crea una password (min 8 caratteri)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="lg"
            />
            
            <Input
              type="password"
              placeholder="Conferma password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              size="lg"
            />

            <Button
              onClick={handleActivate}
              loading={loading}
              disabled={!name || !password || !confirmPassword}
              size="lg"
              w="full"
            >
              Attiva Account
            </Button>
          </VStack>

          <Text fontSize="sm" color="text.muted">
            Creando un account, potrai:
          </Text>
          <VStack align="flex-start" fontSize="sm" color="text.onPage" pl={4}>
            <Text>✅ Prenotare la tua consulenza iniziale</Text>
            <Text>✅ Accedere alla piattaforma di coaching</Text>
            <Text>✅ Scaricare l'app con il tuo piano personalizzato</Text>
            <Text>✅ Comunicare con la tua coach</Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
```

---

### Step 5: Login System

```typescript
// apps/api/src/auth/auth.controller.ts
@Post('login')
async login(@Body() body: { email: string; password: string }) {
  const user = await this.prisma.user.findUnique({
    where: { email: body.email }
  });

  if (!user || !user.password) {
    throw new UnauthorizedException('Credenziali non valide');
  }

  const valid = await bcrypt.compare(body.password, user.password);
  if (!valid) {
    throw new UnauthorizedException('Credenziali non valide');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
}
```

---

## 🔄 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Discovery & Purchase                                        │
│     → Visit website                                             │
│     → Choose plan                                               │
│     → Enter email + accept terms                                │
│     → Pay with Stripe (guest checkout)                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. Automatic Account Creation                                  │
│     → Stripe webhook fires                                      │
│     → API creates User record (email only, no password)         │
│     → API creates Order record (linked to user)                 │
│     → API sends "Activate Account" email                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. Account Activation                                          │
│     → User clicks email link                                    │
│     → Lands on /activate-account?token=xxx                      │
│     → Sets name + password                                      │
│     → Account fully activated                                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. Ongoing Access                                              │
│     → User logs in with email + password                        │
│     → Access to coaching platform                               │
│     → View subscription, book consultations, etc.               │
│     → Can manage subscription via Stripe Customer Portal        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Handling Edge Cases

### Case 1: User Already Has an Account

```typescript
// In webhook handler
let user = await this.prisma.user.findUnique({
  where: { email: session.customer_email }
});

if (user) {
  // User already exists - just create order
  await this.prisma.order.create({ /* ... */ });
  
  // Send "New Order" email (not activation email)
  await this.emailService.sendOrderConfirmation(user.email);
} else {
  // New user - create account and send activation
  user = await this.prisma.user.create({ /* ... */ });
  await this.emailService.sendAccountActivation(user.email, user.id);
}
```

### Case 2: User Doesn't Activate Account

**Reminder emails:**
```typescript
// Cron job: apps/api/src/cron/activation-reminders.ts
@Cron('0 10 * * *') // Daily at 10am
async sendActivationReminders() {
  // Find users created >24h ago who haven't set password
  const inactiveUsers = await this.prisma.user.findMany({
    where: {
      password: null,
      createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      // Only send reminder once
      activationReminderSent: false
    }
  });

  for (const user of inactiveUsers) {
    await this.emailService.sendActivationReminder(user.email);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { activationReminderSent: true }
    });
  }
}
```

### Case 3: User Wants to Login Before Activating

```typescript
// Login page checks if account needs activation
const user = await this.prisma.user.findUnique({
  where: { email: body.email }
});

if (user && !user.password) {
  throw new BadRequestException(
    'Il tuo account non è ancora stato attivato. Controlla la tua email per il link di attivazione.'
  );
}
```

---

## 📊 Database Schema Updates

```prisma
model User {
  id                      String         @id @default(cuid())
  email                   String         @unique
  name                    String?
  password                String?        // Null until activation
  role                    UserRole       @default(CLIENT)
  stripeCustomerId        String?        @unique @map("stripe_customer_id")
  
  // Activation tracking
  emailVerified           Boolean        @default(false)
  activationReminderSent  Boolean        @default(false)
  activatedAt             DateTime?      @map("activated_at")
  
  orders                  Order[]
  subscriptions           Subscription[]
  createdAt               DateTime       @default(now()) @map("created_at")
  updatedAt               DateTime       @updatedAt @map("updated_at")

  @@map("users")
}
```

---

## ✨ Benefits of This Approach

| Benefit | Description |
|---------|-------------|
| 🚀 **Higher Conversion** | No registration friction before purchase |
| 🎯 **Motivated Users** | Users who paid are motivated to complete setup |
| 🔒 **Secure** | Magic link + password gives strong security |
| 📧 **Clean Data** | Email is source of truth, no duplicate accounts |
| 💼 **Professional** | Same pattern as Stripe, Shopify, Notion |
| 🔄 **Flexible** | Works for both new and existing users |

---

## 🆚 Alternative Approaches (Not Recommended)

### ❌ Option 1: Force Registration Before Purchase
```
User Flow: Register → Verify Email → Browse Plans → Purchase
```
**Problems:**
- 25-35% drop-off rate
- Users hate this
- Abandoned accounts (registered but never purchased)

### ❌ Option 2: Completely Separate Systems
```
Purchase System (guest) ← → Coaching Platform (separate login)
```
**Problems:**
- Complex data sync
- User confusion ("Why do I need two accounts?")
- Support nightmare

---

## 🎯 Implementation Checklist

- [ ] Update Stripe webhook to auto-create users
- [ ] Add `password` field to User model (nullable)
- [ ] Implement JWT-based activation token
- [ ] Create `/activate-account` page
- [ ] Create activation email template
- [ ] Add login endpoint with password check
- [ ] Handle "account exists" scenario
- [ ] Add activation reminder cron job
- [ ] Update login page to detect unactivated accounts
- [ ] Add "Resend activation email" feature

---

## 🚀 Next Steps

Would you like me to:

1. **Implement the authentication system** (JWT, activation, login)
2. **Create the activation page** for web-coaching
3. **Update the webhook handler** to auto-create users
4. **Set up email templates** for activation/reminders

This is the modern, conversion-optimized approach used by successful SaaS platforms! 🎉

