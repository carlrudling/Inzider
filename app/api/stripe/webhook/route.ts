import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import dbConnect from '@/utils/database';
import Purchase from '@/models/Purchase';
import config from '@/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: Request) {
  const body = await req.text();
  const reqHeaders = await headers();
  const sig = reqHeaders.get('stripe-signature');

  if (!sig) {
    return new NextResponse('No signature', { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      config.stripe.webhookSecret!
    );

    await dbConnect();

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);

        // Update purchase status if needed
        await Purchase.findOneAndUpdate(
          { stripePaymentId: paymentIntent.id },
          { status: 'completed' }
        );
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', failedPayment.id);

        // Update purchase status
        await Purchase.findOneAndUpdate(
          { stripePaymentId: failedPayment.id },
          { status: 'failed' }
        );
        break;

      case 'charge.refunded':
        const refund = event.data.object as Stripe.Charge;
        console.log('Payment refunded:', refund.payment_intent);

        // Update purchase status
        if (refund.payment_intent) {
          await Purchase.findOneAndUpdate(
            { stripePaymentId: refund.payment_intent },
            { status: 'refunded' }
          );
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse('Webhook handled', { status: 200 });
  } catch (err) {
    console.error('Webhook error:', err);
    return new NextResponse(
      'Webhook error: ' +
        (err instanceof Error ? err.message : 'Unknown error'),
      { status: 400 }
    );
  }
}
