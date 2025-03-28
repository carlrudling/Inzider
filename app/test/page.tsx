'use client';
import React from 'react';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Tailwind Test Page
        </h1>
        <p className="text-gray-600">
          If you can see this styled properly, Tailwind is working!
        </p>
      </div>
    </div>
  );
}
