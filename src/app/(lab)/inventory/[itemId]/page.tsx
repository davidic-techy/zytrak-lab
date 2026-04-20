'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, Activity, Info } from 'lucide-react';
import { MOCK_INVENTORY } from '@/lib/mock-data';
import { Card3D } from '@/components/shared/Card3D';

export default function InventoryItemPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params?.itemId as string;
  
  const item = MOCK_INVENTORY.find(i => i.id === itemId);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-6xl mb-4">📦</p>
        <h2 className="text-xl font-bold text-gray-900">Item not found</h2>
        <button
          onClick={() => router.back()}
          className="mt-5 text-sm text-blue-600 hover:underline"
        >
          ← Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Navigation */}
      <button 
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Inventory
      </button>

      {/* Item Header Card */}
      <div className="bg-linear-to-br from-blue-600 to-blue-900 rounded-2xl p-6 text-white shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {(item as any).name || (item as any).product_name || 'Unnamed Item'}
            </h1>
            <p className="text-blue-100 text-sm">ID: {item.id}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <p className="text-[10px] uppercase tracking-wider font-bold opacity-70">Current Stock</p>
            <p className="text-xl font-black">{(item as any).stock_level || (item as any).quantity || 0}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <p className="text-[10px] uppercase tracking-wider font-bold opacity-70">Status</p>
            <p className="text-xl font-black capitalize">{(item as any).status || 'Active'}</p>
          </div>
        </div>
      </div>

      {/* Details Card */}
      <Card3D className="bg-white p-6">
        <h2 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
          <Info size={16} className="text-blue-600" />
          Technical Specifications
        </h2>
        <div className="space-y-4">
          {[
            { label: 'Batch Number', value: (item as any).batch_number || (item as any).batch || 'N/A' },
            { label: 'Expiry Date', value: (item as any).expiry_date || (item as any).expiry || 'N/A' },
            { label: 'Category', value: (item as any).category || 'General' },
            { label: 'Location', value: (item as any).location || 'Main Warehouse' },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">{row.label}</span>
              <span className="text-sm font-bold text-gray-900 font-mono">{row.value}</span>
            </div>
          ))}
        </div>
      </Card3D>

      {/* Activity / Audit Trail Placeholder */}
      <Card3D className="bg-white p-6 opacity-60">
        <h2 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
          <Activity size={16} />
          Recent Activity
        </h2>
        <p className="text-xs text-gray-500 italic">Blockchain provenance logs loading...</p>
      </Card3D>
    </div>
  );
}