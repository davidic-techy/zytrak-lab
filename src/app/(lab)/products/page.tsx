'use client';

import { useState } from 'react';
import { ShoppingCart, Search, Filter, ShieldCheck } from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_SUPPLIERS } from '@/lib/mock-data';
import { useSupplierStore }              from '@/lib/store';
import { ProductCard }                   from '@/components/lab/ProductCard';
import { PRODUCT_CATEGORIES }            from '@/lib/constants';
import { EmptyState }                    from '@/components/ui/EmptyState';
import { ModuleHeader }                  from '@/components/shared/ModuleHeader';
import { Card3D }                        from '@/components/shared/Card3D';

export default function ProductsPage() {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('');
  const { approved }            = useSupplierStore();

  const filtered = MOCK_PRODUCTS.filter(p => {
    const q           = search.toLowerCase();
    const matchSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.nafdac_number.toLowerCase().includes(q) ||
      p.supplier_name.toLowerCase().includes(q);
    const matchCat    = !category || p.category === category;
    return matchSearch && matchCat;
  });

  // Count how many unique suppliers in filtered results are verified
  const supplierIds    = Array.from(new Set(filtered.map(p => p.supplier_id)));
  const verifiedInView = supplierIds.filter(id => !!approved[id]).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Cohesive Blue Module Header */}
      <ModuleHeader
        icon={<ShoppingCart size={28} className="text-white drop-shadow-sm" />}
        title="Zytrak Marketplace"
        tagline="Procure verified medical supplies from trusted partners"
        gradient="bg-gradient-to-br from-blue-600 to-blue-900"
        stats={
          verifiedInView > 0 
            ? [{ label: "Verified Suppliers", value: `${verifiedInView} / ${supplierIds.length}` }]
            : undefined
        }
      />

      {/* Upgraded Search & Filter Bar */}
      <Card3D noPad className="overflow-hidden bg-white shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          
          {/* Search Input */}
          <div className="flex-1 flex items-center gap-3 px-5 py-4 focus-within:bg-blue-50/30 transition-colors">
            <Search size={20} className="text-gray-400" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, NAFDAC number, or supplier..."
              className="w-full border-0 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent" 
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-3 px-5 py-4 bg-gray-50/30 sm:w-64 focus-within:bg-blue-50/30 transition-colors">
            <Filter size={18} className="text-gray-400" />
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)}
              className="w-full border-0 outline-none text-sm text-gray-700 bg-transparent cursor-pointer appearance-none"
            >
              <option value="">All categories</option>
              {PRODUCT_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          
        </div>
      </Card3D>

      {/* Product Grid - Core logic untouched */}
      {filtered.length === 0 ? (
        <EmptyState 
          title="No products found" 
          description="Try a different search term or category." 
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(p => {
            // Safe lookup to prevent undefined errors
            const isVerified  = !!approved[p.supplier_id];
            const explorerUrl = approved[p.supplier_id]?.explorerUrl;
            
            return (
              <div key={p.id} className="transition-transform hover:-translate-y-1">
                <ProductCard
                  product={p}
                  supplierVerified={isVerified}
                  supplierExplorerUrl={explorerUrl}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}