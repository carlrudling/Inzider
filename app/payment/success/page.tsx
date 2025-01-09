'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStripe, Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function PaymentSuccessContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const stripe = useStripe();
  const router = useRouter();

  useEffect(() => {
    if (!stripe) return;

    // Retrieve the "payment_intent_client_secret" query parameter
    const clientSecret = searchParams.get('payment_intent_client_secret');

    if (!clientSecret) {
      setStatus('error');
      setMessage('Invalid payment session');
      return;
    }

    // Retrieve the PaymentIntent
    stripe
      .retrievePaymentIntent(clientSecret)
      .then(async ({ paymentIntent }) => {
        if (!paymentIntent) {
          throw new Error('Payment intent not found');
        }

        const contentId = searchParams.get('contentId');
        const contentType = searchParams.get('contentType');

        if (!contentId || !contentType) {
          throw new Error('Missing content information');
        }

        console.log('Payment intent retrieved:', {
          id: paymentIntent.id,
          status: paymentIntent.status,
          contentId,
          contentType,
        });

        switch (paymentIntent.status) {
          case 'succeeded':
            // Create the purchase record
            try {
              const response = await fetch('/api/purchases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contentId,
                  contentType,
                  stripePaymentId: paymentIntent.id,
                }),
              });

              if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                  `Failed to create purchase record: ${errorText}`
                );
              }

              setStatus('success');
              setMessage('Payment successful! Redirecting...');

              // Redirect after a short delay
              setTimeout(() => {
                router.push('/user');
              }, 2000);
            } catch (error) {
              setStatus('error');
              setMessage(
                'Payment successful but failed to record purchase. Please contact support.'
              );
              console.error('Purchase creation error:', {
                error: error instanceof Error ? error.message : error,
                stack: error instanceof Error ? error.stack : undefined,
              });
            }
            break;

          case 'processing':
            setStatus('loading');
            setMessage('Your payment is processing.');
            break;

          case 'requires_payment_method':
            setStatus('error');
            setMessage('Your payment was not successful, please try again.');
            break;

          default:
            setStatus('error');
            setMessage('Something went wrong.');
            break;
        }
      })
      .catch((error) => {
        setStatus('error');
        setMessage('Error checking payment status.');
        console.error('Payment verification error:', {
          error: error instanceof Error ? error.message : error,
          stack: error instanceof Error ? error.stack : undefined,
        });
      });
  }, [stripe, searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              {message || 'Processing your payment...'}
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="mt-4 text-lg font-semibold text-gray-900">
              Payment Successful!
            </p>
            <p className="mt-2 text-gray-600">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="mt-4 text-lg font-semibold text-gray-900">
              Payment Error
            </p>
            <p className="mt-2 text-gray-600">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentSuccessContent />
    </Elements>
  );
}
