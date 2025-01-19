'use client';
import React from 'react';
import TripForm from '@/components/TripForm';
import { useRouter } from 'next/navigation';
import { useCreatorData } from '@/provider/CreatorProvider';

const CreateTripPage = () => {
  const router = useRouter();
  const { creatorData } = useCreatorData();

  if (!creatorData) {
    return <div>Loading creator data...</div>;
  }

  return (
    <TripForm
      isEditing={false}
      onSave={async (data, status) => {
        const response = await fetch('/api/trips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, creatorId: creatorData._id }),
        });

        const result = await response.text();
        console.log('Server response:', result);
        if (!response.ok) {
          console.error('Error creating Trip:', result);
          alert(result || 'Error creating Trip');
          return false;
        } else {
          alert('Trip created successfully!');
          router.push('/dashboard');
          return true;
        }
      }}
    />
  );
};

export default CreateTripPage;
