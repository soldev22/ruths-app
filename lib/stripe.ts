import Stripe from 'stripe';

// Allow server to start without Stripe keys for development
// The payment routes will fail gracefully if keys are missing
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

if (!stripeSecretKey) {
  console.warn('⚠️  WARNING: STRIPE_SECRET_KEY is not set. Payment features will not work.');
  console.warn('   See PAYMENT_SETUP.md for setup instructions.');
}

export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-11-17.clover',
    })
  : null;

// Product prices in pence
export const PRICES = {
  single: 500, // £5.00
  bundle5: 2000, // £20.00 (£4 each)
  bundle10: 4000, // £40.00 (£4 each)
};

export const BUNDLES = {
  single: { credits: 1, price: PRICES.single, savings: 0 },
  bundle5: { credits: 5, price: PRICES.bundle5, savings: 500 },
  bundle10: { credits: 10, price: PRICES.bundle10, savings: 1000 },
};
