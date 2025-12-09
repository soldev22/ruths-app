# Stripe Payment Integration - Complete Setup Guide

## 🎉 What's Been Implemented

Your app now has **full Stripe payment processing** for individual teachers to purchase dyslexia assessment credits!

### Features:
- ✅ Secure Stripe Checkout integration
- ✅ Three pricing tiers (Single £5, Bundle of 5 £20, Bundle of 10 £40)
- ✅ Automatic credit addition after successful payment
- ✅ Webhook handling for payment confirmation
- ✅ Activity logging for all transactions
- ✅ Purchase buttons on both Pricing and Account pages
- ✅ Payment success/failure notifications

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Get Stripe Account
1. Sign up at https://stripe.com
2. You'll start in **Test Mode** (perfect for development)

### Step 2: Add Your Stripe Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your keys and add them to `.env.local`:

```bash
# Add these to your .env.local file:
STRIPE_SECRET_KEY=sk_test_51...your_key...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...your_key...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Step 3: Set Up Webhook (for local testing)

**Option A: For Local Development (Recommended)**

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli#install
2. Open a new terminal and run:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/payment/webhook
   ```
3. Copy the webhook signing secret that appears (starts with `whsec_`)
4. Add to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_...your_secret...
   ```

**Option B: For Production**

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/payment/webhook`
4. Select event: `checkout.session.completed`
5. Copy the signing secret and add to `.env.local`

---

## 🧪 Testing Payments

### Test Card Numbers:
- **Successful payment:** `4242 4242 4242 4242`
- **Payment declined:** `4000 0000 0000 0002`
- **Requires authentication:** `4000 0025 0000 3155`

### Test Details:
- **Expiry:** Any future date (e.g., 12/34)
- **CVC:** Any 3 digits (e.g., 123)
- **ZIP:** Any 5 digits (e.g., 12345)

### How to Test:
1. Make sure Stripe CLI is running (`stripe listen --forward-to localhost:3000/api/payment/webhook`)
2. Go to http://localhost:3000/protected/pricing
3. Click "Purchase Now" on any bundle
4. Use test card 4242 4242 4242 4242
5. Complete checkout
6. You'll be redirected back with success message
7. Check your account - credits should be added!

---

## 📋 Payment Flow

### What Happens When User Buys Credits:

1. **User clicks "Buy Now"** on Pricing or Account page
2. **Checkout session created** via `/api/payment/create-checkout`
3. **User redirected to Stripe** (secure hosted checkout page)
4. **User enters card details** (handled entirely by Stripe - PCI compliant)
5. **Payment processed** by Stripe
6. **Webhook fired** to `/api/payment/webhook` with payment confirmation
7. **Credits added** to user's `prepaidCredits` in MongoDB
8. **Activity logged** in ActivityLog collection
9. **User redirected back** to `/protected/account?payment=success`
10. **Success message shown** and balance updated

---

## 🔍 Verify It's Working

### Check the Console:
When webhook receives payment, you should see:
```
[WEBHOOK] Added 5 credits to user user@example.com (ID: 123...)
[WEBHOOK] New balance: 5 credits
```

### Check MongoDB:
```javascript
// User document should have updated prepaidCredits
{
  email: "user@example.com",
  prepaidCredits: 5,  // Incremented!
  screeningsUsed: 0,
  ...
}

// ActivityLog should have payment record
{
  userId: "...",
  userEmail: "user@example.com",
  activityType: "login",  // Using login as activity type
  metadata: {
    action: "credit_purchase",
    bundleType: "bundle5",
    creditsAdded: 5,
    amountPaid: 2000,  // £20.00 in pence
    currency: "gbp",
    stripeSessionId: "cs_test_..."
  }
}
```

---

## 🛠️ Files Created/Modified

### New Files:
- `lib/stripe.ts` - Stripe configuration and pricing
- `app/api/payment/create-checkout/route.ts` - Creates Stripe checkout session
- `app/api/payment/webhook/route.ts` - Handles payment confirmations
- `.env.local.example` - Environment variable template
- `STRIPE_SETUP.md` - Detailed setup guide

### Modified Files:
- `app/protected/pricing/page.tsx` - Added Stripe payment buttons
- `app/protected/account/page.tsx` - Added quick purchase buttons
- `package.json` - Added stripe and @stripe/stripe-js dependencies

---

## 🎯 Pricing Structure

| Bundle | Credits | Price | Per Assessment | Savings |
|--------|---------|-------|----------------|---------|
| Single | 1 | £5 | £5.00 | - |
| Bundle of 5 | 5 | £20 | £4.00 | £5 |
| Bundle of 10 | 10 | £40 | £4.00 | £10 |

---

## 🔐 Security Features

- ✅ **PCI Compliant:** Stripe handles all card data (never touches your servers)
- ✅ **Webhook Verification:** Cryptographic signature verification prevents fraud
- ✅ **HTTPS Required:** Production webhooks require HTTPS
- ✅ **No Card Storage:** Card details never stored in your database
- ✅ **Activity Logging:** Every transaction logged for audit trail
- ✅ **User Authentication:** Only authenticated users can purchase

---

## 🚨 Troubleshooting

### "Webhook signature verification failed"
- Ensure `STRIPE_WEBHOOK_SECRET` matches your webhook endpoint
- For local testing, make sure Stripe CLI is running
- Check the webhook secret hasn't expired

### "Payment successful but no credits added"
- Check server console for webhook errors
- Verify MongoDB connection is working
- Check ActivityLog collection for error logs
- Ensure webhook event type is `checkout.session.completed`

### "Payment not processing"
- Verify API keys are correct (test mode keys start with `sk_test_` and `pk_test_`)
- Check browser console for errors
- Ensure `.env.local` is loaded (restart dev server after adding keys)

### "Redirect loop or not returning to site"
- Verify `NEXT_PUBLIC_BASE_URL` is set correctly
- Check success/cancel URLs in checkout session

---

## 📊 Monitoring Payments

### Stripe Dashboard:
- View all payments: https://dashboard.stripe.com/payments
- View customers: https://dashboard.stripe.com/customers
- View webhooks: https://dashboard.stripe.com/webhooks
- Check logs: https://dashboard.stripe.com/logs

### Your App:
- Activity Logs page: http://localhost:3000/admin/activity-logs
- Filter by user to see their purchase history
- Check `metadata.action === "credit_purchase"` for payments

---

## 🌐 Going to Production

When ready to accept real payments:

1. **Activate your Stripe account** (complete business verification)
2. **Switch to live mode** in Stripe dashboard
3. **Get live API keys** (start with `pk_live_` and `sk_live_`)
4. **Update `.env.local`** with live keys:
   ```bash
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   ```
5. **Create production webhook** pointing to `https://yourdomain.com/api/payment/webhook`
6. **Update webhook secret** in `.env.local`
7. **Test with real card** (use small amount first!)
8. **Monitor dashboard** for first few days

---

## 💡 Next Steps

1. **Test the payment flow** with test cards
2. **Verify credits are added** to user accounts
3. **Check activity logs** to confirm logging
4. **Customize email receipts** in Stripe dashboard (optional)
5. **Set up Stripe billing portal** for invoice management (optional)
6. **Add email notifications** when credits are purchased (future enhancement)

---

## 📞 Support

- **Stripe Docs:** https://stripe.com/docs
- **Stripe Support:** https://support.stripe.com
- **Test Cards:** https://stripe.com/docs/testing

---

## ✅ Checklist

- [ ] Stripe account created
- [ ] Test API keys added to `.env.local`
- [ ] Stripe CLI installed and running
- [ ] Webhook secret added to `.env.local`
- [ ] Dev server restarted
- [ ] Test payment completed successfully
- [ ] Credits added to test user account
- [ ] Activity log shows purchase record
- [ ] Ready for production!

---

**You're all set! Try making a test purchase to see it in action! 🎉**
