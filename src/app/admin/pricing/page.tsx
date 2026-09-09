import React from 'react';

export const metadata = {
  title: 'Pricing Tiers | Admin Portal',
};

export default function AdminPricingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-playfair text-primary">Pricing Tiers</h1>
      </div>
      
      <div className="bg-white rounded-xl p-8 border border-secondary/20 shadow-sm text-center py-20">
        <h2 className="text-xl font-bold text-primary mb-2">Pricing Management</h2>
        <p className="text-secondary">This page is under construction. Pricing tier configuration features will be added here.</p>
      </div>
    </div>
  );
}
