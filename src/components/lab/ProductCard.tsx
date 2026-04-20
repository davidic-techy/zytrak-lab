"use client";
import { useCartStore } from "@/lib/store";
import type { MockProduct } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  product: MockProduct;
  supplierVerified?: boolean;
  supplierExplorerUrl?: string;
}

export function ProductCard({ product, supplierVerified, supplierExplorerUrl }: Props) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      unitPriceNgn: product.unit_price_ngn,
      supplierName: product.supplier_name,
      supplierOrgId: product.supplier_id,
      quantity: 1,
      temperatureProfile: product.temperature_profile,
    });
    toast.success("Added to cart");
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all h-full flex flex-col overflow-hidden">
      
      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-3 mb-2">
          <h3 className="font-bold text-gray-900 leading-tight">{product.name}</h3>
          <span className="text-sm font-black text-blue-700 shrink-0 bg-blue-50 px-2 py-1 rounded-lg">
            {formatCurrency(product.unit_price_ngn)}
          </span>
        </div>
        
        <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        <div className="mt-auto space-y-2 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-gray-50">
            <span className="text-gray-500">Supplier</span>
            <div className="flex items-center gap-1 justify-end min-w-0">
              <span className="font-bold text-gray-900 truncate ml-2">{product.supplier_name}</span>
              {supplierVerified && (
                <ShieldCheck size={14} className="text-blue-600 shrink-0" />
              )}
            </div>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-gray-50">
            <span className="text-gray-500">NAFDAC</span>
            <span className="font-mono font-medium text-gray-900">{product.nafdac_number}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-500">Storage</span>
            <span className="font-medium text-gray-900 capitalize">{product.temperature_profile}</span>
          </div>
        </div>

        {/* Small On-Chain link if approved */}
        {supplierVerified && supplierExplorerUrl && (
          <div className="mt-3 pt-3 border-t border-gray-50">
            <a 
              href={supplierExplorerUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] flex items-center justify-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-bold tracking-wide uppercase transition-colors"
            >
              View Supplier On-Chain Record ↗
            </a>
          </div>
        )}
      </div>
      
      {/* Brand Color Add to Cart Button */}
      <div className="p-4 bg-gray-50/50 border-t border-gray-100">
        <button
          onClick={handleAdd}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}