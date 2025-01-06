// provider/CreatorProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Schema } from 'mongoose';

interface CreatorData {
  _id?: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  profileImage?: string;
  description?: string;
  instagram?: string;
  xLink?: string;
  tiktok?: string;
  youtube?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  gotoButtonColor?: string;
  gotoButtonText?: string;
  backgroundImage?: string;
  textColor?: string;
  discountCode?: string; // Or reference a DiscountCode model
  myTrips: Schema.Types.ObjectId[];
  myGotos: Schema.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface CreatorContextValue {
  creatorData: CreatorData | null;
  loading: boolean;
  error: string | null;
}

const CreatorContext = createContext<CreatorContextValue>({
  creatorData: null,
  loading: true,
  error: null,
});

export const CreatorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session } = useSession();
  const [creatorData, setCreatorData] = useState<CreatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        // Only fetch by email since that's the reliable identifier
        const res = await fetch(
          `/api/creators/by-email/${encodeURIComponent(session.user.email)}`
        );

        if (!res.ok) {
          setError('Failed to fetch creator data');
          setLoading(false);
          return;
        }

        const data = await res.json();
        setCreatorData(data);
        setLoading(false);
      } catch (err: any) {
        setError('Error fetching creator data');
        setLoading(false);
      }
    };
    fetchCreatorData();
  }, [session]);

  return (
    <CreatorContext.Provider value={{ creatorData, loading, error }}>
      {children}
    </CreatorContext.Provider>
  );
};

export function useCreatorData() {
  return useContext(CreatorContext);
}
