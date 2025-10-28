# 📧 Email Automation Guide

## Overview

Supabase **does not** have built-in email automation/marketing features. However, you can build powerful email flows using:

1. **Supabase Database + Triggers** (for event detection)
2. **Email Service Provider** (for sending emails)
3. **Supabase Edge Functions** or **NestJS API** (for logic)

---

## ✅ Recommended Architecture

### Option 1: Using Resend (Recommended for transactional emails)

**Resend** is a modern email API with great developer experience and reasonable pricing.

```typescript
// Install Resend
pnpm add resend

// apps/api/src/email/email.service.ts
import { Resend } from 'resend';

export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendWelcomeEmail(email: string, name: string) {
    await this.resend.emails.send({
      from: 'Petra Coaching <petra@yourdomaim.com>',
      to: email,
      subject: 'Benvenuta nel percorso Petra! 🏋️‍♀️',
      html: `<h1>Ciao ${name}!</h1><p>Siamo entusiasti di iniziare questo percorso insieme...</p>`,
    });
  }

  async sendOrderConfirmation(email: string, orderId: string, planName: string) {
    await this.resend.emails.send({
      from: 'Petra Coaching <petra@yourdomain.com>',
      to: email,
      subject: 'Ordine Confermato! 🎉',
      html: `
        <h1>Grazie per il tuo ordine!</h1>
        <p>Il tuo ordine #${orderId} è stato confermato.</p>
        <p>Piano: ${planName}</p>
        <p>Riceverai presto i dettagli per prenotare la tua consulenza iniziale.</p>
      `,
    });
  }

  async sendConsultationLink(email: string, bookingLink: string) {
    await this.resend.emails.send({
      from: 'Petra Coaching <petra@yourdomain.com>',
      to: email,
      subject: 'Prenota la tua consulenza iniziale 📅',
      html: `
        <h1>È ora di prenotare la tua consulenza!</h1>
        <p>Clicca sul link per scegliere il giorno e l'ora che preferisci:</p>
        <a href="${bookingLink}">Prenota ora</a>
      `,
    });
  }
}
```

### Option 2: Using SendGrid (Better for marketing automation)

**SendGrid** has marketing automation features like drip campaigns, segmentation, etc.

```typescript
// Install SendGrid
pnpm add @sendgrid/mail

// apps/api/src/email/email.service.ts
import sgMail from '@sendgrid/mail';

export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendWelcomeEmail(email: string, name: string) {
    await sgMail.send({
      to: email,
      from: 'petra@yourdomain.com',
      subject: 'Benvenuta nel percorso Petra! 🏋️‍♀️',
      html: `<h1>Ciao ${name}!</h1>`,
    });
  }

  // Add user to marketing list (if they opted in)
  async addToMarketingList(email: string, firstName: string) {
    await sgMail.request({
      method: 'PUT',
      url: '/v3/marketing/contacts',
      body: {
        list_ids: [process.env.SENDGRID_LIST_ID],
        contacts: [
          {
            email,
            first_name: firstName,
          },
        ],
      },
    });
  }
}
```

---

## 🔄 Email Automation Flows

### 1. Post-Purchase Flow

**Trigger**: Stripe webhook `checkout.session.completed`

```typescript
// apps/api/src/stripe/stripe.controller.ts

@Post('webhook')
async handleWebhook(@Body() event: any) {
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // 1. Create user and order in database
    const user = await this.createUser(session.customer_email);
    const order = await this.createOrder(user.id, session);
    
    // 2. Send immediate confirmation email
    await this.emailService.sendOrderConfirmation(
      user.email,
      order.id,
      order.planId
    );
    
    // 3. Send consultation booking link (1 hour later)
    await this.scheduleEmail({
      to: user.email,
      template: 'consultation-booking',
      delay: '1 hour',
      data: { bookingLink: 'https://calendly.com/petra/...' }
    });
    
    // 4. Add to marketing list if opted in
    if (order.consent.marketingOptIn) {
      await this.emailService.addToMarketingList(user.email, user.name);
    }
  }
}
```

### 2. Onboarding Drip Campaign

**Day 0**: Welcome + booking link  
**Day 2**: Reminder to book (if not booked)  
**Day 5**: Pre-workout tips  
**Day 7**: Check-in email

You can implement this with:

**Option A**: Use a job queue (Bull/BullMQ)

```typescript
// apps/api/src/email/email-queue.service.ts
import { Queue } from 'bullmq';

export class EmailQueueService {
  private emailQueue = new Queue('emails', {
    connection: { host: 'localhost', port: 6379 }
  });

  async scheduleOnboardingSequence(userId: string, email: string) {
    // Day 0 - Welcome
    await this.emailQueue.add('welcome', { userId, email }, { delay: 0 });
    
    // Day 2 - Reminder
    await this.emailQueue.add('booking-reminder', { userId, email }, { 
      delay: 2 * 24 * 60 * 60 * 1000 // 2 days
    });
    
    // Day 5 - Tips
    await this.emailQueue.add('workout-tips', { userId, email }, { 
      delay: 5 * 24 * 60 * 60 * 1000 // 5 days
    });
    
    // Day 7 - Check-in
    await this.emailQueue.add('check-in', { userId, email }, { 
      delay: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }
}
```

**Option B**: Use SendGrid Marketing Campaigns (no code needed)

---

## 🛠️ Implementation Steps

### Step 1: Choose Email Provider

| Provider     | Best For             | Pricing          |
| ------------ | -------------------- | ---------------- |
| **Resend**   | Transactional emails | 3,000 free/month |
| **SendGrid** | Marketing automation | 100/day free     |
| **Mailgun**  | High volume          | 5,000 free/month |
| **Postmark** | Transactional only   | 100 free/month   |

**Recommendation**: Start with **Resend** for transactional + **SendGrid** for marketing.

### Step 2: Add to Your API

```bash
cd /Users/mattiapapa/Code/petra/petra-platform/apps/api

# Install Resend
pnpm add resend

# Add to .env
echo "RESEND_API_KEY=re_xxx" >> .env
echo "SENDGRID_API_KEY=SG.xxx" >> .env
```

### Step 3: Create Email Service

```typescript
// apps/api/src/email/email.module.ts
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
```

### Step 4: Use in Stripe Webhook

```typescript
// apps/api/src/stripe/stripe.controller.ts
import { EmailService } from '../email/email.service';

export class StripeController {
  constructor(private emailService: EmailService) {}

  @Post('webhook')
  async handleWebhook(@Body() event: any) {
    if (event.type === 'checkout.session.completed') {
      // Send email
      await this.emailService.sendOrderConfirmation(...);
    }
  }
}
```

---

## 📊 Supabase Database Triggers (Advanced)

You can also use PostgreSQL triggers + Supabase Edge Functions:

```sql
-- Create a function to notify on new orders
CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'new_order',
    json_build_object(
      'order_id', NEW.id,
      'user_id', NEW.user_id,
      'email', (SELECT email FROM users WHERE id = NEW.user_id)
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER order_created
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_order();
```

Then listen in your API:

```typescript
// apps/api/src/database/database.service.ts
import { Client } from 'pg';

export class DatabaseService {
  private client = new Client({ connectionString: process.env.DATABASE_URL });

  async listenToOrders() {
    await this.client.connect();
    await this.client.query('LISTEN new_order');
    
    this.client.on('notification', async (msg) => {
      const { email, order_id } = JSON.parse(msg.payload);
      await this.emailService.sendOrderConfirmation(email, order_id);
    });
  }
}
```

---

## 🎯 Recommended Email Flow for Petra

### Transactional Emails (Resend)
1. ✅ Order confirmation (immediate)
2. 📅 Consultation booking link (1 hour after purchase)
3. ⏰ Booking reminder (if not booked in 2 days)
4. 🎉 Pre-consultation welcome (1 day before)
5. 📱 App credentials (after consultation)
6. 📊 Program ready notification (when uploaded)

### Marketing Emails (SendGrid - only if opted in)
1. Weekly tips and motivation
2. Success stories
3. New programs/offers
4. Renewal reminders

---

## 📝 Next Steps

1. **Sign up** for Resend: https://resend.com
2. **Verify your domain** (petra.com or similar)
3. **Create email templates** (HTML)
4. **Implement EmailService** in your API
5. **Test with test mode** before going live

Let me know if you want me to implement the EmailService for you! 🚀

