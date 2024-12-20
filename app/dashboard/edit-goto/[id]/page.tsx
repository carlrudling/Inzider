'use client';
import React, { useEffect, useState } from 'react';
import GoToForm from '@/components/GotoForm';

interface Spot {
  title: string;
  location: string;
  description: string;
  specifics: { label: string; value: string }[];
  slides: File[];
}

const EditGoToPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
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
          alert('Error updating GoTo');
        } else {
          alert('GoTo updated successfully!');
        }
      }}
    />
  );
};

export default EditGoToPage;
