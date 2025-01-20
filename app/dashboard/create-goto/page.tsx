'use client';
import React from 'react';
import GotoForm from '@/components/GotoForm';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const CreateGoToPage = () => {
  const handleSave = async (data: any, status: 'edit' | 'launch') => {
    const response = await fetch('/api/gotos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error('Error creating GoTo:', errorMessage);
      alert(errorMessage);
    } else {
      alert('GoTo created successfully!');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <GotoForm isEditing={false} onSave={handleSave} />
    </DndProvider>
  );
};

export default CreateGoToPage;
