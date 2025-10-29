# 🌐 Domain Setup Guide: coachingpetra.com

This guide shows you how to connect your `coachingpetra.com` domain to Resend for sending emails.

---

## 📋 Prerequisites

- ✅ Domain purchased: `coachingpetra.com` (on Cloudflare)
- ✅ Resend account created
- ✅ Resend API key obtained

---

## 🚀 Step-by-Step Setup

### Step 1: Get Your Resend API Key

1. Go to [Resend Dashboard](https://resend.com)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **Create API Key**
5. Give it a name (e.g., "Petra Production")
6. Copy the key (starts with `re_...`)
7. Save it securely - you'll need it for your `.env` file

### Step 2: Add Domain to Resend

1. In Resend Dashboard, go to **Domains** section
2. Click **Add Domain**
3. Enter: `coachingpetra.com`
4. Click **Add Domain**
5. Resend will show you **DNS records** you need to add

### Step 3: Configure DNS Records in Cloudflare

Resend will show you records like these (example):

```
Type: TXT
Name: @ (or blank)
Content: resend-verification=abc123xyz...

Type: TXT
Name: _resend
Content: resend-domain-key=def456uvw...

Type: MX
Name: @
Priority: 10
Value: feedback-smtp.resend.com
```

#### **How to Add DNS Records in Cloudflare:**

1. **Log in to Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Select your domain: `coachingpetra.com`

2. **Navigate to DNS Settings**
   - Click **DNS** in the left sidebar
   - Click **Records**

3. **Add TXT Record for Domain Verification**
   - Click **Add record**
   - **Type**: Select `TXT`
   - **Name**: Enter `@` (or leave blank/root)
   - **Content**: Paste the verification string from Resend (e.g., `resend-verification=abc123...`)
   - **TTL**: Select `Auto`
   - Click **Save**

4. **Add TXT Record for SPF**
   - Click **Add record** again
   - **Type**: Select `TXT`
   - **Name**: Enter `@` (or leave blank)
   - **Content**: `v=spf1 include:resend.com ~all`
   - **TTL**: Select `Auto`
   - Click **Save**

5. **Add MX Record for Email Inbound**
   - Click **Add record**
   - **Type**: Select `MX`
   - **Name**: Enter `@` (or leave blank)
   - **Priority**: Enter `10`
   - **Mail Server**: Enter `feedback-smtp.resend.com`
   - **TTL**: Select `Auto`
   - Click **Save**

6. **Add DKIM Record (if shown by Resend)**
   - Click **Add record**
   - **Type**: Select `TXT`
   - **Name**: Enter `_resend` (or whatever Resend tells you)
   - **Content**: Paste the DKIM key from Resend
   - **TTL**: Select `Auto`
   - Click **Save**

### Step 4: Verify Domain in Resend

1. **Wait for DNS Propagation** (usually 5-60 minutes)
   - Cloudflare DNS usually propagates quickly (< 5 minutes)
   - You can check DNS propagation: [dnschecker.org](https://dnschecker.org)

2. **Verify in Resend Dashboard**
   - Go back to Resend Dashboard
   - Click on your domain `coachingpetra.com`
   - Click **Verify Domain** button
   - Wait for verification (usually takes 1-2 minutes)

3. **Check Status**
   - ✅ **Green checkmark** = Domain verified!
   - ❌ **Red X** = Check DNS records again

### Step 5: Update Your API `.env` File

```bash
# Navigate to API directory
cd /Users/mattiapapa/Code/petra/petra-platform/apps/api

# Edit .env file
nano .env
```

Add/update these lines:

```env
# Resend Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@coachingpetra.com
RESEND_FROM_NAME=Petra Coaching
```

**Common Email Addresses:**
- `noreply@coachingpetra.com` - For automated emails (order confirmations, etc.)
- `petra@coachingpetra.com` - For personal emails from Petra
- `info@coachingpetra.com` - For general inquiries
- `support@coachingpetra.com` - For customer support

### Step 6: Update Email Service Code

Update your `email.service.ts` to use the new domain:

```typescript
// apps/api/src/email/email.service.ts
async sendTestEmail(name: string) {
  await this.resend.emails.send({
    from: 'Petra Coaching <noreply@coachingpetra.com>', // ✅ Use your domain
    to: 'Mattia Papa <mp.web3@gmail.com>',
    subject: '🎉 Test Email da Petra Coaching',
    html: `<h1>Ciao ${name}!</h1><p>Questo è un test.</p>`
  });
}
```

### Step 7: Test Email Sending

1. **Start your API server:**
   ```bash
   cd /Users/mattiapapa/Code/petra/petra-platform
   pnpm --filter @petra/api dev
   ```

2. **Send a test email:**
   ```bash
   # Using curl
   curl -X POST http://localhost:3001/api/email/test \
     -H "Content-Type: application/json" \
     -d '{"name": "Mattia"}'
   ```

3. **Check your email inbox** (check spam folder too!)

---

## 🔍 Troubleshooting

### Issue: Domain Verification Fails

**Solution:**
1. Double-check DNS records match exactly what Resend shows
2. Wait 10-15 minutes for DNS propagation
3. Verify DNS records are correct:
   ```bash
   # Check TXT records
   dig TXT coachingpetra.com
   
   # Check MX records
   dig MX coachingpetra.com
   ```

### Issue: Emails Going to Spam

**Solution:**
1. Ensure SPF record is correct: `v=spf1 include:resend.com ~all`
2. Ensure DKIM record is added correctly
3. Check Resend dashboard shows domain as "Verified"
4. Add DMARC record (optional but recommended):
   ```
   Type: TXT
   Name: _dmarc
   Content: v=DMARC1; p=none; rua=mailto:petra@coachingpetra.com
   ```

### Issue: Cloudflare Proxy Interfering

**Solution:**
1. In Cloudflare DNS records, click the **orange cloud** to turn it **gray** (DNS only)
2. This disables Cloudflare proxy for DNS records
3. Only proxy A/CNAME records for your website, not email records

### Issue: "Domain not verified" Error

**Solution:**
1. Check Resend dashboard → Domains → Status
2. Click "Verify" again
3. Check DNS records are correct:
   - TXT record with verification string
   - SPF record
   - MX record

---

## 📊 DNS Records Summary

Here's what your Cloudflare DNS should look like:

| Type | Name      | Content                          | Priority | Proxy      |
| ---- | --------- | -------------------------------- | -------- | ---------- |
| TXT  | @         | `resend-verification=...`        | -        | 🟡 DNS only |
| TXT  | @         | `v=spf1 include:resend.com ~all` | -        | 🟡 DNS only |
| TXT  | `_resend` | `resend-domain-key=...`          | -        | 🟡 DNS only |
| MX   | @         | `feedback-smtp.resend.com`       | 10       | 🟡 DNS only |

**⚠️ Important:** Make sure DNS records are set to **DNS only** (gray cloud), not proxied (orange cloud).

---

## ✅ Verification Checklist

- [ ] Resend account created
- [ ] API key obtained and added to `.env`
- [ ] Domain added to Resend dashboard
- [ ] TXT verification record added in Cloudflare
- [ ] SPF record added (`v=spf1 include:resend.com ~all`)
- [ ] MX record added (`feedback-smtp.resend.com`)
- [ ] DKIM record added (if shown by Resend)
- [ ] DNS records set to "DNS only" (not proxied)
- [ ] Domain verified in Resend dashboard (green checkmark)
- [ ] Test email sent successfully
- [ ] Email received in inbox (not spam)

---

## 🎯 Next Steps After Setup

1. **Update all email addresses** in your code:
   - Order confirmations → `noreply@coachingpetra.com`
   - Account activation → `noreply@coachingpetra.com`
   - Consultation booking → `noreply@coachingpetra.com`

2. **Create email templates** using Handlebars:
   - Welcome email
   - Order confirmation
   - Account activation
   - Booking reminder

3. **Set up email automation flows**:
   - Post-purchase confirmation
   - Account activation link
   - Consultation booking link

4. **Monitor email delivery**:
   - Check Resend dashboard → Logs
   - Monitor bounce rates
   - Check spam complaints

---

## 📚 Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend Domain Setup](https://resend.com/docs/dashboard/domains/introduction)
- [Cloudflare DNS Documentation](https://developers.cloudflare.com/dns/)
- [Email Deliverability Best Practices](https://resend.com/docs/introduction)

---

Need help? Check the troubleshooting section or reach out! 🚀

