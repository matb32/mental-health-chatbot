# Testing Guide - ADHD Assessment Tool

This guide will help you test the payment, report generation, and email functionality.

## Prerequisites

Before testing, you need to set up the following services:

### 1. Stripe Test Mode (For Payments)

1. **Create Stripe Account** (if you don't have one):
   - Go to https://stripe.com
   - Sign up for free (no credit card required for test mode)

2. **Get Test API Keys**:
   - Go to https://dashboard.stripe.com/test/apikeys
   - Copy your test keys (they start with `pk_test_` and `sk_test_`)

3. **Add to Vercel Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add/Update these variables:
     ```
     STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_TEST_KEY
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_TEST_KEY
     NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
     ```
   - **Important**: Replace the dummy values with your real test keys
   - Redeploy the app after updating

### 2. Gmail App Password (For Email)

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to https://myaccount.google.com/security
   - Turn on 2-Step Verification

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "ADHD Assessment Tool"
   - Copy the 16-character password

3. **Add to Vercel Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add these variables:
     ```
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASSWORD=your-16-char-app-password
     ```
   - Redeploy the app after updating

---

## Testing Checklist

### ✅ Test 1: Payment Flow with Stripe Test Mode

1. **Complete the Assessment**:
   - Fill in Personal Information
   - Complete ASRS, GAD-7, PHQ-9, and DIVA sections
   - Navigate to Results page

2. **Test Successful Payment**:
   - Click "Purchase Full Report - £1.00"
   - On Stripe Checkout page, use these **test card details**:
     - Card Number: `4242 4242 4242 4242`
     - Expiry: Any future date (e.g., `12/34`)
     - CVC: Any 3 digits (e.g., `123`)
     - Postal Code: Any valid format (e.g., `12345`)
   - Click "Pay"
   - You should redirect to payment-success page
   - Message should show "Payment Successful!"

3. **Test Failed Payment** (Optional):
   - Start a new assessment
   - Try payment with decline test card: `4000 0000 0000 0002`
   - Should show "Your card was declined"

4. **Verify in Stripe Dashboard**:
   - Go to https://dashboard.stripe.com/test/payments
   - You should see your £1.00 test payment

### ✅ Test 2: Report Download

1. **After Successful Payment**:
   - Click "View & Download Your Report"
   - On Results page, verify green success banner shows
   - Click "Download Report (TXT)"
   - File should download: `ADHD-Assessment-YourName.txt`

2. **Verify Report Content**:
   - Open the downloaded file
   - Check it contains:
     - ✓ Patient information
     - ✓ ASRS scores
     - ✓ DIVA detailed symptom breakdown
     - ✓ GAD-7 and PHQ-9 scores
     - ✓ Clinical interpretation
     - ✓ Referral recommendations

### ✅ Test 3: Report Printing

1. **On Results Page** (after payment):
   - Click "Print Report"
   - Print dialog should open
   - Preview should show formatted HTML report
   - Test printing or save as PDF

### ✅ Test 4: Email Delivery

1. **After Successful Payment**:
   - On payment-success page, look for green checkmark message:
     - "Your assessment report has been emailed to you"

2. **Check Your Email** (the one used in Personal Information):
   - Subject: "Your ADHD Assessment Report"
   - From: "ADHD Assessment Tool"
   - Should have `.txt` file attachment
   - Email body should explain next steps

3. **If Email Doesn't Arrive**:
   - Check spam/junk folder
   - Verify EMAIL_USER and EMAIL_PASSWORD are correct in Vercel
   - Check Vercel deployment logs for errors
   - Email may take 1-2 minutes to arrive

---

## Testing Without Payment (Free Features)

You can test the assessment itself without payment:

1. **Complete Assessment**:
   - Fill in all sections
   - View Results page

2. **Free Summary**:
   - You can see score summaries for free
   - ASRS, DIVA, GAD-7, PHQ-9 scores visible
   - Basic interpretation provided

3. **Payment Required For**:
   - ❌ Full comprehensive GP referral report
   - ❌ Download report
   - ❌ Print report
   - ❌ Email report

---

## Troubleshooting

### Payment Issues

**Problem**: "Environment Variable error" when deploying
- **Fix**: Make sure you've updated the Stripe keys in Vercel (not just .env.local)
- **Fix**: Redeploy after updating environment variables

**Problem**: Payment page doesn't load
- **Fix**: Check NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY starts with `pk_test_`
- **Fix**: Open browser console (F12) and check for errors

**Problem**: Payment completes but report doesn't unlock
- **Fix**: Clear browser localStorage and try again
- **Fix**: Check browser console for verification errors

### Email Issues

**Problem**: No email received
- **Fix**: Check Gmail spam folder
- **Fix**: Verify EMAIL_USER and EMAIL_PASSWORD in Vercel environment variables
- **Fix**: Check you created a Gmail App Password (not regular password)
- **Fix**: Check Vercel function logs for errors

**Problem**: Email sending error in logs
- **Fix**: Verify 2FA is enabled on Gmail account
- **Fix**: Make sure App Password is the 16-character code (no spaces)
- **Fix**: Try generating a new App Password

**Problem**: Email arrives but no attachment
- **Fix**: Check that assessment data was properly saved
- **Fix**: Verify report-generator function is working (test download first)

### General Issues

**Problem**: DIVA section not showing
- **Fix**: Make sure you're on the latest deployment
- **Fix**: Clear browser cache and hard reload (Ctrl+Shift+R)
- **Fix**: Check you completed ASRS Part B before DIVA

**Problem**: "Report not available" error
- **Fix**: Complete entire assessment before trying to access results
- **Fix**: Don't refresh the page during assessment (data is in localStorage)

---

## Test Card Numbers Reference

Stripe provides these test cards for different scenarios:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0000 0000 0002` | ❌ Card declined |
| `4000 0000 0000 9995` | ❌ Insufficient funds |
| `4000 0000 0000 0069` | ❌ Expired card |

All test cards:
- Expiry: Any future date
- CVC: Any 3 digits
- Postal Code: Any valid format

---

## Environment Variables Summary

For Vercel deployment, you need these environment variables:

```bash
# Stripe (Get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App URL (Your Vercel deployment URL)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Email (Gmail with App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=16-char-app-password
```

---

## Next Steps After Testing

Once everything works:

1. ✅ Verify payment flow end-to-end
2. ✅ Test report download
3. ✅ Test report printing
4. ✅ Test email delivery
5. 🚀 Ready for production use!

**Note**: These are all in TEST MODE. Real charges will not be made. To go live, you need to:
- Get Stripe live mode keys (requires business verification)
- Update environment variables with live keys
- Remove test warnings from UI
