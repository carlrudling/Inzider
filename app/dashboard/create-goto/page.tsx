'use client';
import React from 'react';
import GoToForm from '@/components/GotoForm';

const CreateGoToPage = () => {
  const handleSave = async (data: any, status: 'edit' | 'launch') => {
    const response = await fetch('/api/gotos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json(); // Parse the response body
    console.log(result); // Log the error or response for debugging

    if (!response.ok) {
      console.error('Error creating GoTo:', result);
      alert('Error creating GoTo');
    } else {
      alert('GoTo created successfully!');
    }
  };

  return <GoToForm isEditing={false} onSave={handleSave} />;
};

export default CreateGoToPage;
