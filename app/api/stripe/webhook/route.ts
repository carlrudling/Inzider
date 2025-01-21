import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import dbConnect from '@/lib/dbConnect';
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
    console.log('No Stripe signature found in webhook request');
    return new NextResponse('No signature', { status: 400 });
  }

  try {
    console.log(
      'Constructing Stripe event with signature:',
      sig.substring(0, 20) + '...'
    );
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      config.stripe.webhookSecret!
    );
    console.log('Webhook event constructed:', event.type);

    await dbConnect();
    console.log('Connected to database');

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', {
          id: paymentIntent.id,
          metadata: paymentIntent.metadata,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        });

        // Update purchase status if needed
        const updatedPurchase = await Purchase.findOneAndUpdate(
          { stripePaymentId: paymentIntent.id },
          { status: 'completed' },
          { new: true }
        );
        console.log(
          'Updated purchase:',
          updatedPurchase
            ? {
                id: updatedPurchase._id,
                status: updatedPurchase.status,
                stripePaymentId: updatedPurchase.stripePaymentId,
              }
            : 'No purchase found'
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
