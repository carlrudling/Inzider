'use client';
import React, { useEffect, useState } from 'react';
import TripForm from '@/components/TripForm';

interface Day {
  date: Date;
  spots: {
    title: string;
    location: string;
    description: string;
    specifics: { label: string; value: string }[];
    slides: Array<File | { src: string; type: 'image' | 'video' }>;
  }[];
}

const EditTripPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [initialData, setInitialData] = useState<
    | {
        id: string;
        title?: string;
        price?: string;
        currency?: string;
        description?: string;
        slides?: Array<File | { src: string; type: 'image' | 'video' }>;
        specifics?: { label: string; value: string }[];
        days?: Day[];
        startDate?: Date;
        endDate?: Date;
        status?: 'edit' | 'launch';
      }
    | undefined
  >(undefined);

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
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          console.error('Failed to update Trip');
          alert('Error updating Trip');
        } else {
          alert('Trip updated successfully!');
        }
      }}
    />
  );
};

export default EditTripPage;
