'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, ShieldCheck, Package } from 'lucide-react';
import { MOCK_SUPPLIERS, MOCK_PRODUCTS } from '@/lib/mock-data';
import { CheckoutButton } from '@/components/marketplace/CheckoutButton';

export default function SupplierStorefront() {
  const params = useParams();
  const router = useRouter();
  const supplierId = params?.supplierId as string;
  
  const supplier = MOCK_SUPPLIERS.find(s => s.id === supplierId);
  const products = MOCK_PRODUCTS.filter(p => p.supplier_id === supplierId);

  if (!supplier) {
    return <div className="p-10 text-center">Supplier not found</div>;
  }

  const isWeb3 = supplier.payment_method?.includes('Freighter') || false;
  const XLM_RATE = 185; 

  return (
    // FIXED: Added px-4 wrapper
    <div className="w-full max-w-5xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      
      <button 
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Marketplace
      </button>

      <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
        {/* FIXED: Flex-col on mobile, flex-row on desktop. Gap added so they don't overlap. */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex flex-wrap items-center gap-2">
              {supplier.name}
              {(supplier.trust_level === 'premium' || supplier.trust_level === 'verified') && (
                 <ShieldCheck size={24} className="text-blue-600 shrink-0" />
              )}
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base">NAFDAC: {supplier.nafdac_licence}</p>
          </div>
          
          {/* FIXED: text-left on mobile, text-right on desktop */}
          <div className="text-left md:text-right w-full md:w-auto bg-gray-50 md:bg-transparent p-3 md:p-0 rounded-xl">
            <div className="flex items-center justify-start md:justify-end gap-2 text-gray-600 font-medium text-sm md:text-base">
              <MapPin size={18} className="text-gray-400" />
              {supplier.country}
            </div>
            <p className="text-sm text-gray-500 md:text-gray-400 mt-1">Trust Score: {supplier.performance_score}/100</p>
          </div>
        </div>
      </div>

      <h2 className="text-lg md:text-xl font-bold text-gray-900 mt-8 mb-4">Available Inventory ({products.length})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {products.map(product => {
          const xlmPrice = parseFloat((product.unit_price_ngn / XLM_RATE).toFixed(2));

          return (
            <div key={product.id} className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm flex flex-col h-full">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{product.category.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-2 mb-6">
                <p className="line-clamp-2">{product.description}</p>
                <div className="flex justify-between border-t border-gray-50 pt-2 mt-2">
                  <span className="text-gray-400">NAFDAC:</span>
                  <span className="font-mono text-xs md:text-sm truncate max-w-30">{product.nafdac_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Storage:</span>
                  <span className="capitalize">{product.temperature_profile}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Unit Price</p>
                    <p className="text-xl md:text-2xl font-black text-gray-900">₦{product.unit_price_ngn.toLocaleString()}</p>
                  </div>
                  {isWeb3 && <p className="text-sm font-bold text-blue-600">≈ {xlmPrice} XLM</p>}
                </div>

                {isWeb3 && supplier.publicKey ? (
                  <CheckoutButton 
                    supplierPublicKey={supplier.publicKey} 
                    orderTotalAmount={xlmPrice} 
                    onSuccess={() => router.push('/balance')}
                  />
                ) : (
                  <button className="w-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors py-3 px-4 rounded-xl font-bold shadow-sm text-sm md:text-base">
                    Pay ₦{product.unit_price_ngn.toLocaleString()}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}