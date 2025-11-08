# ✅ Petra Platform Deployment Checklist

Quick reference for deploying the Petra Platform to production.

---

## 🗄️ Database (Supabase)

- [x] Supabase project created
- [x] Prisma user created with proper permissions
- [x] Database connection tested locally
- [x] All migrations applied
- [x] SSL connection configured
- [ ] Network restrictions configured (allow Railway IPs or all IPs)
- [ ] Database backups enabled
- [ ] Connection pooling configured (if needed)

**Status:** ✅ **COMPLETE**

---

## 🚂 Backend (Railway)

### Pre-Deployment

- [ ] All code committed and pushed to GitHub
- [ ] Dockerfile tested locally
- [ ] Environment variables documented
- [ ] JWT_SECRET generated (secure random string)
- [ ] Stripe API keys obtained (test or live)
- [ ] All 12 Stripe Price IDs obtained
- [ ] Resend API key obtained
- [ ] Admin email addresses configured

### Deployment

- [ ] Railway account created
- [ ] Project created from GitHub repo
- [ ] All environment variables added
- [ ] Deployment triggered and successful
- [ ] Railway domain generated
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

### Post-Deployment

- [ ] API health check responds (GET /)
- [ ] Plans endpoint working (GET /plans)
- [ ] Auth endpoint working (POST /auth/login)
- [ ] Database connection verified
- [ ] Logs show no errors
- [ ] Stripe webhooks configured
- [ ] Test webhook delivery
- [ ] Test checkout flow end-to-end

**Status:** 🔜 **NEXT**

---

## 🌐 Frontend - Marketing Site (Vercel/Netlify)

### Pre-Deployment

- [ ] Code reviewed and tested locally
- [ ] Environment variables documented
- [ ] API URL from Railway obtained
- [ ] Stripe publishable key obtained

### Deployment

- [ ] Platform chosen (Vercel recommended for Next.js)
- [ ] Project connected to GitHub
- [ ] Environment variables added:
  - [ ] `NEXT_PUBLIC_API_URL`
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] Deployment successful
- [ ] Custom domain configured
- [ ] SSL certificate active

### Post-Deployment

- [ ] Homepage loads correctly
- [ ] Pricing page shows plans
- [ ] Checkout flow works
- [ ] Stripe payment successful
- [ ] Activation email received
- [ ] Account activation works
- [ ] Login works

**Status:** ⏳ **PENDING**

---

## 🎨 Frontend - Coaching Platform (Vercel/Netlify)

### Pre-Deployment

- [ ] Code reviewed and tested locally
- [ ] Environment variables documented
- [ ] API URL from Railway obtained
- [ ] Protected routes configured

### Deployment

- [ ] Platform chosen (Vercel recommended for Next.js)
- [ ] Project connected to GitHub
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Custom domain configured
- [ ] SSL certificate active

### Post-Deployment

- [ ] Login page works
- [ ] Protected routes require auth
- [ ] User dashboard loads
- [ ] Subscription status displayed
- [ ] Content accessible based on plan

**Status:** ⏳ **PENDING**

---

## 💳 Stripe Configuration

- [ ] Stripe account created
- [ ] Product catalog created
- [ ] All 12 subscription plans created
- [ ] Price IDs copied to environment variables
- [ ] Webhook endpoint configured
- [ ] Webhook events selected:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.created`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
  - [ ] `invoice.payment_succeeded`
  - [ ] `invoice.payment_failed`
- [ ] Webhook secret copied to Railway
- [ ] Test payment processed successfully
- [ ] Production keys ready (when going live)

**Status:** ⏳ **PENDING**

---

## 📧 Email Service (Resend)

- [ ] Resend account created
- [ ] API key generated
- [ ] Domain verified (optional but recommended)
- [ ] Email templates tested
- [ ] Activation email works
- [ ] Welcome email works
- [ ] Password reset email works (when implemented)

**Status:** ⏳ **PENDING**

---

## 🔐 Security

- [ ] All secrets are environment variables (not hardcoded)
- [ ] JWT_SECRET is cryptographically secure (64+ chars)
- [ ] Database connection uses SSL
- [ ] CORS configured for frontend domains only
- [ ] Rate limiting enabled
- [ ] Helmet middleware configured (security headers)
- [ ] No sensitive data in logs
- [ ] No database credentials in git history
- [ ] `.env` files in `.gitignore`

**Status:** 🔜 **REVIEW NEEDED**

---

## 🧪 Testing

### Backend API

- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Checkout flow tested end-to-end
- [ ] Webhook handling tested
- [ ] Auth flow tested (signup, login, activation)
- [ ] Error handling tested
- [ ] Rate limiting tested

### Frontend

- [ ] UI components tested
- [ ] Checkout flow tested
- [ ] Payment flow tested
- [ ] Auth flow tested
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Browser compatibility tested

**Status:** ⏳ **PENDING**

---

## 📊 Monitoring & Analytics

- [ ] Railway metrics enabled
- [ ] Error tracking configured (Sentry, LogRocket, etc.)
- [ ] Uptime monitoring (optional: UptimeRobot, Pingdom)
- [ ] Google Analytics configured (frontend)
- [ ] Stripe dashboard monitoring
- [ ] Email delivery monitoring
- [ ] Database performance monitoring (Supabase dashboard)

**Status:** ⏳ **PENDING**

---

## 📝 Documentation

- [x] Supabase connection guide
- [x] Railway deployment guide
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Frontend setup guide
- [ ] Environment variables reference
- [ ] Troubleshooting guide
- [ ] Runbook for common operations

**Status:** 🔄 **IN PROGRESS**

---

## 🚀 Go-Live Checklist

### Before Launch

- [ ] All systems deployed and tested
- [ ] End-to-end user journey tested
- [ ] Stripe in production mode (not test mode)
- [ ] Production environment variables set
- [ ] Custom domains configured and working
- [ ] SSL certificates active on all domains
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Contact information available
- [ ] GDPR compliance verified
- [ ] Cookie consent implemented (if needed)

### Launch Day

- [ ] Backup created
- [ ] Monitoring dashboards open
- [ ] Team ready for support
- [ ] Rollback plan documented
- [ ] Announcement ready

### Post-Launch

- [ ] Monitor logs for errors
- [ ] Monitor Stripe for payments
- [ ] Monitor email delivery
- [ ] Check user feedback
- [ ] Performance monitoring
- [ ] Fix any issues immediately

**Status:** ⏳ **NOT STARTED**

---

## 🔢 Order of Deployment

```
1. ✅ Database (Supabase) - DONE
2. 🔜 Backend API (Railway) - NEXT
3. ⏳ Marketing Website (Vercel)
4. ⏳ Coaching Platform (Vercel)
5. ⏳ Configure Stripe webhooks
6. ⏳ Test end-to-end
7. ⏳ Go live
```

---

## 📞 Support Resources

- **Railway:** https://discord.gg/railway
- **Supabase:** https://supabase.com/support
- **Stripe:** https://support.stripe.com
- **Vercel:** https://vercel.com/support
- **Resend:** https://resend.com/support

---

**Last Updated:** January 2025

