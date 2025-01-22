'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<'creator' | 'user' | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!type) {
        throw new Error('Please select if you want to be a creator or user');
      }

      // Check if user exists and what type they have
      const checkRes = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!checkRes.ok) {
        throw new Error('Failed to check user status');
      }

      const { exists, type: existingType } = await checkRes.json();

      // If they already have this type of account, redirect to sign in
      if (exists && existingType === type) {
        setError(
          'You already have this type of account. Please sign in instead.'
        );
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
        return;
      }

      // Add retry logic
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          const result = await signIn('credentials', {
            email,
            password,
            name,
            mode: 'signup',
            type,
            redirect: false,
          });

          if (result?.error) {
            // If they're adding a new account type, show a different message
            if (result.error === 'You already have this type of account') {
              setError(
                'You already have this type of account. Please sign in instead.'
              );
              setTimeout(() => {
                router.push('/auth/signin');
              }, 2000);
              return;
            }
            throw new Error(result.error);
          }

          if (result?.ok) {
            router.push('/auth/check-type');
            return;
          }

          throw new Error('Authentication failed');
        } catch (err) {
          if (retryCount === maxRetries - 1) {
            throw err;
          }
          retryCount++;
          // Wait for a short time before retrying
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/auth/check-type' });
  };

  // Show type selection first
  if (!showForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Choose Your Account Type
          </h1>
          <p className="mb-6 text-center text-gray-600">
            Select how you want to use Inzider
          </p>

          <div className="space-y-4 mb-6">
            <button
              onClick={() => {
                setType('creator');
                setShowForm(true);
              }}
              className="w-full py-4 px-4 rounded-lg border hover:border-blue-500 transition-all"
            >
              <div className="font-semibold text-lg mb-1">Creator</div>
              <div className="text-sm text-gray-600">
                I want to create and sell trips and guides
              </div>
            </button>

            <button
              onClick={() => {
                setType('user');
                setShowForm(true);
              }}
              className="w-full py-4 px-4 rounded-lg border hover:border-blue-500 transition-all"
            >
              <div className="font-semibold text-lg mb-1">User</div>
              <div className="text-sm text-gray-600">
                I want to discover and purchase trips and guides
              </div>
            </button>
          </div>

          <div className="mt-4 text-center text-sm">
            <Link href="/auth/signin" className="text-blue-500 hover:underline">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show registration form after type selection
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 mb-4"
        >
          <Image
            src="/google.svg"
            alt="Google"
            width={20}
            height={20}
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link href="/auth/signin" className="text-blue-500 hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
