# Stripe Payment Integration Setup

## Overview
The app now has full Stripe payment integration for individual teachers to purchase assessment credits.

## Setup Steps

### 1. Create a Stripe Account
1. Go to https://stripe.com and sign up for an account
2. Complete your business information

### 2. Get API Keys
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. Add these to your `.env.local` file:
   ```
   STRIPE_SECRET_KEY=sk_test_your_key_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   ```

### 3. Set Up Webhook
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/payment/webhook`
   - For local testing, use: `http://localhost:3000/api/payment/webhook`
   - For local testing, you'll need to use Stripe CLI (see below)
4. Select events to listen for: `checkout.session.completed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```

### 4. Testing Locally with Stripe CLI

To test webhooks locally:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to Stripe CLI:
   ```
   stripe login
   ```
3. Forward webhooks to your local server:
   ```
   stripe listen --forward-to localhost:3000/api/payment/webhook
   ```
4. The CLI will display a webhook signing secret - use this in your `.env.local`

### 5. Test Payment

Use Stripe test cards:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- Use any future expiry date, any 3-digit CVC

## How It Works

1. **User Clicks Purchase Button**
   - User goes to Pricing page or Account page
   - Clicks "Buy Now" for single assessment or bundle

2. **Checkout Session Created**
   - API call to `/api/payment/create-checkout`
   - Creates Stripe Checkout session with user details
   - Redirects user to Stripe-hosted payment page

3. **User Completes Payment**
   - User enters card details on secure Stripe page
   - Stripe processes payment

4. **Webhook Receives Confirmation**
   - Stripe sends `checkout.session.completed` event to `/api/payment/webhook`
   - Server verifies webhook signature
   - Adds credits to user's account in MongoDB
   - Logs activity in ActivityLog

5. **User Redirected Back**
   - Success: Redirects to `/protected/account?payment=success`
   - Cancel: Redirects to `/protected/pricing?payment=cancelled`
   - Account page displays updated credit balance

## Pricing Structure

- **Single Assessment:** £5 (1 credit)
- **Bundle of 5:** £20 (5 credits) - Save £5
- **Bundle of 10:** £40 (10 credits) - Save £10

## Security Features

- Webhook signature verification prevents fraud
- Stripe handles all payment processing (PCI compliant)
- No card details stored in your database
- User email automatically associated with payment
- Activity logging for audit trail

## Production Deployment

Before going live:

1. **Switch to Live Keys**
   - Get live API keys from Stripe dashboard
   - Update `.env.local` with live keys (starting with `pk_live_` and `sk_live_`)

2. **Update Webhook Endpoint**
   - Create new webhook in Stripe dashboard pointing to your production URL
   - Update `STRIPE_WEBHOOK_SECRET` with production webhook secret

3. **Set Production URL**
   - Update `NEXT_PUBLIC_BASE_URL` in `.env.local` to your production domain

4. **Test Thoroughly**
   - Complete full payment flow with test cards
   - Verify credits are added correctly
   - Check webhook logs in Stripe dashboard

## Troubleshooting

### Webhook not receiving events
- Check webhook URL is correct
- Verify webhook secret matches
- Check Stripe dashboard webhook logs
- For local testing, ensure Stripe CLI is running

### Payment successful but credits not added
- Check server logs for webhook errors
- Verify MongoDB connection
- Check ActivityLog collection for payment records

### Redirect not working
- Verify `NEXT_PUBLIC_BASE_URL` is set correctly
- Check success/cancel URLs in checkout session

## Support

For Stripe-specific issues, check:
- Stripe Dashboard: https://dashboard.stripe.com
- Stripe Docs: https://stripe.com/docs
- Stripe API Reference: https://stripe.com/docs/api
