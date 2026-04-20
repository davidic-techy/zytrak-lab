'use client';

import { useState } from 'react';
import { Search, MapPin, Globe2, Layers } from 'lucide-react';
import { MOCK_SUPPLIERS } from '@/lib/mock-data';
import { SupplierCard } from '@/components/marketplace/SupplierCard';

type FilterType = 'all' | 'local' | 'international';

export default function MarketplacePage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery]   = useState('');

  // 1. Filter the suppliers based on the Tab AND the Search input
  const filteredSuppliers = MOCK_SUPPLIERS.filter(supplier => {
    const matchesFilter = activeFilter === 'all' || supplier.type === activeFilter;
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          supplier.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Verified Marketplace</h1>
        <p className="text-gray-500 mb-8 max-w-2xl">
          Procure medical supplies and diagnostic equipment from NAFDAC-verified suppliers globally. Pay instantly using local fiat or cross-border USDC.
        </p>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          
          {/* Tab Toggles */}
          <div className="flex w-full md:w-auto bg-gray-100/50 rounded-xl p-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeFilter === 'all' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Layers size={16} />
              All
            </button>
            <button
              onClick={() => setActiveFilter('local')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeFilter === 'local' ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MapPin size={16} />
              Local (Nigeria)
            </button>
            <button
              onClick={() => setActiveFilter('international')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeFilter === 'international' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-100' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Globe2 size={16} />
              International
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search suppliers or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm text-sm outline-none"
            />
          </div>

        </div>
      </div>

      {/* Supplier Grid */}
      {filteredSuppliers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map(supplier => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <p className="text-4xl mb-4">🔍</p>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No suppliers found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your filters or search terms.</p>
        </div>
      )}

    </div>
  );
}