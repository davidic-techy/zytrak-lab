'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { MOCK_INVENTORY } from '@/lib/mock-data';
import { Card3D } from '@/components/shared/Card3D';

export default function InventoryItemPage() {
  const { itemId } = useParams();
  const router = useRouter();
  
  const item = MOCK_INVENTORY.find(i => i.id === itemId);

  if (!item) {
    return <div className="p-10 text-center">Item not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600"
      >
        <ArrowLeft size={16} /> Back to Inventory
      </button>

      <Card3D className="bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
        <p className="text-gray-500">Batch: {item.batch_number}</p>
        <div className="mt-4 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm font-bold text-blue-700">Stock Level: {item.stock_level}</p>
        </div>
      </Card3D>
    </div>
  );
}