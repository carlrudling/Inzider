'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Loader from '@/components/Loader';

export default function CheckType() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session?.user && !session.user.needsTypeSelection) {
      // If user doesn't need type selection, redirect them
      router.push(session.user.type === 'creator' ? '/dashboard' : '/user');
    }
  }, [session, router]);

  // Show loader while checking session
  if (status === 'loading' || isLoading) {
    return <Loader />;
  }

  // If no session, redirect to sign in
  if (!session) {
    router.push('/auth/signin');
    return <Loader />;
  }

  const handleTypeSelection = async (selectedType: 'creator' | 'user') => {
    try {
      setIsLoading(true);
      setError('');

      // Get the correct ID for the selected type
      const res = await fetch('/api/auth/get-account-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user?.email,
          type: selectedType,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get account ID');
      }

      const { id } = await res.json();

      // If selecting a type they don't have an account for, create it
      if (
        (selectedType === 'creator' && !session.user?.hasCreatorAccount) ||
        (selectedType === 'user' && !session.user?.hasUserAccount)
      ) {
        const createRes = await fetch('/api/auth/google-type', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: session.user?.email,
            name: session.user?.name,
            type: selectedType,
          }),
        });

        if (!createRes.ok) {
          throw new Error('Failed to set user type');
        }
      }

      // Update the session with the selected type and correct ID
      await update({
        ...session,
        user: {
          ...session.user,
          id,
          type: selectedType,
          needsTypeSelection: false,
        },
      });

      // Redirect based on type
      router.push(selectedType === 'creator' ? '/dashboard' : '/user');
    } catch (error) {
      console.error('Error setting user type:', error);
      setError('Failed to set user type. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Choose Your Account Type
        </h1>
        <p className="mb-6 text-center text-gray-600">
          Select how you want to use Inzider
        </p>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="space-y-4 mb-6">
          <button
            onClick={() => handleTypeSelection('creator')}
            disabled={isLoading}
            className="w-full py-4 px-4 rounded-lg border hover:border-blue-500 transition-all"
          >
            <div className="font-semibold text-lg mb-1">Creator</div>
            <div className="text-sm text-gray-600">
              {session.user?.hasCreatorAccount
                ? 'Continue as Creator'
                : 'I want to create and sell trips and guides'}
            </div>
          </button>

          <button
            onClick={() => handleTypeSelection('user')}
            disabled={isLoading}
            className="w-full py-4 px-4 rounded-lg border hover:border-blue-500 transition-all"
          >
            <div className="font-semibold text-lg mb-1">User</div>
            <div className="text-sm text-gray-600">
              {session.user?.hasUserAccount
                ? 'Continue as User'
                : 'I want to discover and purchase trips and guides'}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
