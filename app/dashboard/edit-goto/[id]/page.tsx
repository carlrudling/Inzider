'use client';
import React, { useEffect, useState } from 'react';
import GoToForm from '@/components/GotoForm';
import { useParams } from 'next/navigation';

interface Spot {
  title: string;
  location: string;
  description: string;
  specifics: { label: string; value: string }[];
  slides: File[];
}

const EditGoToPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const [initialData, setInitialData] = useState<
    | {
        id: string;
        title?: string;
        price?: string;
        currency?: string;
        description?: string;
        slides?: File[];
        specifics?: { label: string; value: string }[];
        spots?: Spot[];
      }
    | undefined
  >(undefined);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/gotos/${id}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setInitialData({ ...data, id }); // Include the id in the initialData
      } catch (error) {
        console.error('Error fetching GoTo:', error);
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
    return <div>GoTo not found.</div>;
  }

  return (
    <GoToForm
      initialData={initialData}
      isEditing={true}
      onSave={async (data, status) => {
        const response = await fetch(`/api/gotos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          console.error('Failed to update GoTo');
          if (response.status === 409) {
            alert(
              'You already have a GoTo with this title. Please choose a different title.'
            );
          } else {
            alert('Error updating GoTo');
          }
          return false; // Return false to indicate save failed
        } else {
          alert('GoTo updated successfully!');
          return true; // Return true to indicate save succeeded
        }
      }}
    />
  );
};

export default EditGoToPage;
