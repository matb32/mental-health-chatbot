import { NextRequest, NextResponse } from 'next/server';
import { stripe, REPORT_PRICE } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { assessmentId, email, fullName } = await req.json();

    if (!assessmentId || !email || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Adult ADHD Assessment Report',
              description: 'Comprehensive medical report for GP referral',
              images: [],
            },
            unit_amount: REPORT_PRICE, // £1.00 in pence
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/results`,
      customer_email: email,
      metadata: {
        assessmentId,
        fullName,
        email,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
