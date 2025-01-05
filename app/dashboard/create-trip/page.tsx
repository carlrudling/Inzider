'use client';
import React from 'react';
import TripForm from '@/components/TripForm';

const CreateGoToPage = () => {
  const handleSave = async (data: any, status: 'edit' | 'launch') => {
    const response = await fetch('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json(); // Parse the response body
    console.log(result); // Log the error or response for debugging

    if (!response.ok) {
      console.error('Error creating Trip:', result);
      alert('Error creating Trip');
    } else {
      alert('Trip created successfully!');
    }
  };

  return <TripForm isEditing={false} onSave={handleSave} />;
};

export default CreateGoToPage;
