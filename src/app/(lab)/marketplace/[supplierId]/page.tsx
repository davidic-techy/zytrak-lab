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
  // Filter products to only show THIS supplier's inventory
  const products = MOCK_PRODUCTS.filter(p => p.supplier_id === supplierId);

  if (!supplier) {
    return <div className="p-10 text-center">Supplier not found</div>;
  }

  const isWeb3 = supplier.payment_method.includes('Freighter');
  const XLM_RATE = 185; // Mock conversion rate

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Navigation */}
      <button 
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Marketplace
      </button>

      {/* Supplier Identity Header */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              {supplier.name}
              {supplier.trust_level === 'premium' || supplier.trust_level === 'verified' ? (
                 <ShieldCheck size={24} className="text-blue-600" />
              ) : null}
            </h1>
            <p className="text-gray-500 mt-2 max-w-2xl">NAFDAC Licence: {supplier.nafdac_licence}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-gray-600 font-medium">
              <MapPin size={18} className="text-gray-400" />
              {supplier.country}
            </div>
            <p className="text-sm text-gray-400 mt-1">Trust Score: {supplier.performance_score}/100</p>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Available Inventory ({products.length})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map(product => {
          // Convert NGN to XLM for the Web3 Checkout
          const xlmPrice = parseFloat((product.unit_price_ngn / XLM_RATE).toFixed(2));

          return (
            <div key={product.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-2 mb-6">
                <p>{product.description}</p>
                <div className="flex justify-between border-t border-gray-50 pt-2 mt-2">
                  <span className="text-gray-400">NAFDAC:</span>
                  <span className="font-mono">{product.nafdac_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Storage:</span>
                  <span>{product.temperature_profile}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Unit Price</p>
                    <p className="text-2xl font-black text-gray-900">₦{product.unit_price_ngn.toLocaleString()}</p>
                  </div>
                  {isWeb3 && <p className="text-sm font-bold text-blue-600">≈ {xlmPrice} XLM</p>}
                </div>

                {/* THE CHECKOUT LOOP IS CLOSED HERE */}
                {isWeb3 && supplier.publicKey ? (
                  <CheckoutButton 
                    supplierPublicKey={supplier.publicKey} 
                    orderTotalAmount={xlmPrice} 
                    onSuccess={() => router.push('/balance')}
                  />
                ) : (
                  <button className="w-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors py-3 px-4 rounded-xl font-bold shadow-sm">
                    Pay ₦{product.unit_price_ngn.toLocaleString()} with Paystack
                  </button>
                )}
              </div>
            </div>
          );
        })}
        
        {products.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No products currently listed for this supplier.
          </div>
        )}
      </div>

    </div>
  );
}