'use client';
import React, { useEffect, useState } from 'react';
import TripForm from '@/components/TripForm';
import { useRouter, useParams } from 'next/navigation';
import { TripData } from '@/types/trip';

const EditTripPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [initialData, setInitialData] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/trips/${id}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

        // Convert date strings to Date objects
        const formattedData = {
          ...data,
          id,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          endDate: data.endDate ? new Date(data.endDate) : undefined,
          days: data.days?.map((day: any) => ({
            ...day,
            date: new Date(day.date),
          })),
        };

        setInitialData(formattedData);
      } catch (error) {
        console.error('Error fetching Trip:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!initialData) {
    return <div>Trip not found.</div>;
  }

  return (
    <TripForm
      initialData={initialData}
      isEditing={true}
      onSave={async (data, status) => {
        const response = await fetch(`/api/trips/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, id }),
        });

        if (!response.ok) {
          console.error('Failed to update Trip');
          const errorText = await response.text();
          alert(errorText || 'Error updating Trip');
          return false;
        } else {
          alert('Trip updated successfully!');
          router.push('/dashboard');
          return true;
        }
      }}
    />
  );
};

export default EditTripPage;
