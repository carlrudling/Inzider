'use client';

import { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
console.log(
  'STRIPE_PUBLISHABLE_KEY:',
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentFormWrapperProps {
  contentId: string;
  contentType: 'trip' | 'goto';
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PaymentFormWrapper({
  contentId,
  contentType,
  onSuccess,
  onError,
}: PaymentFormWrapperProps) {
  console.log('PaymentFormWrapper props:', { contentId, contentType });
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('PaymentFormWrapper mounted');
    console.log('Creating payment intent for:', { contentId, contentType });
    // Create PaymentIntent as soon as the component loads
    fetch('/api/stripe/payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentId, contentType }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Payment intent created:', data);
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error('Error creating payment intent:', error);
        onError(error.message || 'Failed to initialize payment');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [contentId, contentType, onError]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <div className="text-center py-4">Loading payment form...</div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <div className="text-center py-4 text-red-600">
            Failed to initialize payment form. Please try again.
          </div>
        </div>
      </div>
    );
  }

  console.log('Rendering Elements with clientSecret');
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Complete Your Purchase</h3>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: 'stripe',
          },
          locale: 'en',
        }}
      >
        <PaymentForm
          onSuccess={onSuccess}
          onError={onError}
          contentId={contentId}
          contentType={contentType}
        />
      </Elements>
    </div>
  );
}

interface PaymentFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  contentId: string;
  contentType: string;
}

function PaymentForm({
  onSuccess,
  onError,
  contentId,
  contentType,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    console.log('PaymentForm mounted');
    if (!stripe || !elements) {
      console.log('Stripe or elements not initialized');
    }
  }, [stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Payment form submitted');

    if (!stripe || !elements) {
      console.log('Stripe or elements not available');
      setErrorMessage('Payment system not initialized');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      console.log('Confirming payment with content:', {
        contentId,
        contentType,
      });
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
      });

      if (error) {
        console.error('Payment error:', error);
        setErrorMessage(error.message || 'An error occurred');
        onError(error.message || 'An error occurred');
      } else {
        // Payment successful, call onSuccess
        onSuccess();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrorMessage('An unexpected error occurred');
      onError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {errorMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-600">
                Payment Failed
              </h3>
              <button
                onClick={() => setErrorMessage('')}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-700 mb-4">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage('')}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : 'Pay now'}
      </button>
    </form>
  );
}

export default PaymentFormWrapper;
