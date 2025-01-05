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

      // If selecting a type they don't have an account for, create it
      if (
        (selectedType === 'creator' && !session.user?.hasCreatorAccount) ||
        (selectedType === 'user' && !session.user?.hasUserAccount)
      ) {
        const res = await fetch('/api/auth/google-type', {
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

        if (!res.ok) {
          throw new Error('Failed to set user type');
        }
      }

      // Update the session with the selected type
      await update({
        ...session,
        user: {
          ...session.user,
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
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Choose Your Account Type
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="space-y-4">
          <button
            onClick={() => handleTypeSelection('creator')}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {session.user?.hasCreatorAccount
              ? 'Continue as Creator'
              : 'I want to create content'}
          </button>
          <button
            onClick={() => handleTypeSelection('user')}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            {session.user?.hasUserAccount
              ? 'Continue as User'
              : 'I want to explore content'}
          </button>
        </div>
      </div>
    </div>
  );
}
