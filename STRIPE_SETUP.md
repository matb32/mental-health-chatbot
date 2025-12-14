# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payment integration for the ADHD Assessment Platform.

## 1. Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Click "Sign Up" and create an account
3. Complete the registration process
4. You'll automatically be in **Test Mode** (perfect for testing with £1 payments)

## 2. Get Your Stripe API Keys

1. Log into your Stripe Dashboard: [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Make sure you're in **TEST MODE** (toggle in the top-left should say "Test mode")
3. You'll see two keys:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`) - Click "Reveal test key"

## 3. Create Environment Variables File

1. In your project folder, create a file called `.env.local`:

```bash
# In Windows Command Prompt, navigate to your project folder:
cd C:\Users\matpr\Documents\mental-health-chatbot

# Create the file (you can also create it manually in Notepad)
type nul > .env.local
```

2. Open `.env.local` in Notepad and add your Stripe keys:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE

# Application URL (for local testing)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Replace `pk_test_YOUR_PUBLISHABLE_KEY_HERE` and `sk_test_YOUR_SECRET_KEY_HERE` with your actual keys from Step 2

4. **IMPORTANT**: Save the file and make sure it's named exactly `.env.local` (not `.env.local.txt`)

## 4. Install New Dependencies

```bash
npm install
```

This will install the Stripe packages that were added to package.json.

## 5. Test the Payment Flow

### Start the Application

```bash
npm run dev
```

### Complete an Assessment

1. Go to `http://localhost:3000`
2. Click "Start Assessment"
3. Fill out the assessment (you can use dummy data for testing)
4. Complete all sections
5. Click "Submit Assessment"

### Test the Payment

1. On the results page, you'll see:
   - Free assessment summary (visible to everyone)
   - Button to purchase full report for £1.00
2. Click "Purchase Full Report - £1.00"
3. You'll be redirected to Stripe Checkout

### Use Stripe Test Card

On the Stripe checkout page, use these **TEST** card details:

```
Card Number: 4242 4242 4242 4242
Expiry Date: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP Code: Any 5 digits (e.g., 12345)
```

**Other test cards:**
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Requires authentication**: 4000 0025 0000 3155

### After Payment

1. After successful payment, you'll be redirected to the success page
2. Click "View & Download Your Report"
3. You can now download and print the full GP referral report

## 6. View Payments in Stripe Dashboard

1. Go to [https://dashboard.stripe.com/test/payments](https://dashboard.stripe.com/test/payments)
2. You'll see your test payment of £1.00
3. Click on it to see details

## 7. Changing the Price

To change from £1.00 to a different amount:

1. Open `/lib/stripe.ts`
2. Find this line:
   ```typescript
   export const REPORT_PRICE = 100; // £1.00 in pence
   ```
3. Change `100` to your desired amount in **pence**:
   - £5.00 = 500
   - £10.00 = 1000
   - £0.50 = 50

## 8. Going Live (When Ready for Production)

### Switch to Live Mode

1. In Stripe Dashboard, toggle from "Test mode" to "Live mode"
2. Get your **LIVE** API keys: [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
3. Update `.env.local` with live keys:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
   STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY
   ```

### Important Before Going Live

1. **Complete Stripe Account Setup**:
   - Verify your business information
   - Add bank account details for payouts
   - Complete KYC (Know Your Customer) requirements

2. **Update App URL**:
   ```env
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

3. **Set up Webhooks** (optional, for advanced features):
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhook`
   - Select events: `checkout.session.completed`, `payment_intent.payment_failed`
   - Copy webhook signing secret to `.env.local`:
     ```env
     STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
     ```

## 9. Troubleshooting

### "Stripe is not defined" Error

- Make sure `.env.local` file exists and has the correct keys
- Restart your development server: Stop with `Ctrl+C`, then `npm run dev`

### Payment Not Working

- Check that you're using a test card (4242 4242 4242 4242)
- Verify you're in Test Mode in Stripe Dashboard
- Check browser console for errors (press F12)

### Environment Variables Not Loading

- Make sure the file is named `.env.local` (not `.env.local.txt`)
- Make sure it's in the root project folder
- Restart the dev server

### "Payment verification failed"

- This is normal in development if webhooks aren't set up
- The payment will still work, but some advanced features may not

## 10. Security Notes

- **NEVER** commit `.env.local` to Git (it's already in `.gitignore`)
- **NEVER** share your secret keys
- Keep test and live keys separate
- Regenerate keys if they're ever exposed

## Support

- Stripe Documentation: [https://stripe.com/docs](https://stripe.com/docs)
- Stripe Test Cards: [https://stripe.com/docs/testing](https://stripe.com/docs/testing)
- Stripe Support: Available in your dashboard

---

## Quick Start Checklist

- [ ] Create Stripe account
- [ ] Get test API keys
- [ ] Create `.env.local` file
- [ ] Add Stripe keys to `.env.local`
- [ ] Run `npm install`
- [ ] Start app with `npm run dev`
- [ ] Complete a test assessment
- [ ] Test payment with card 4242 4242 4242 4242
- [ ] Download the report after payment
- [ ] Check payment in Stripe Dashboard

**You're ready to test payments! 🎉**
