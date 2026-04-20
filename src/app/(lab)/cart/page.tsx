"use client";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { TemperatureBadge } from "@/components/shared/TemperatureBadge";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CartPage() {
  const { items, updateQty, removeItem, total } = useCartStore();
  const router = useRouter();

  // Group by supplier
  const bySupplier = items.reduce<Record<string,{name:string;items:typeof items}>>((acc,item) => {
    if (!acc[item.supplierOrgId]) acc[item.supplierOrgId] = { name:item.supplierName, items:[] };
    acc[item.supplierOrgId].items.push(item);
    return acc;
  }, {});

  if (!items.length) return (
    <EmptyState title="Your cart is empty" description="Add products from the marketplace to get started."
      action={{ label:"Browse marketplace", onClick:()=>router.push("/products") }} />
  );

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Cart ({items.length} items)</h1>
      {Object.entries(bySupplier).map(([sid,s]) => (
        <div key={sid} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Supplier: {s.name}</p>
          </div>
          {s.items.map(item => (
            <div key={item.productId} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{item.productName}</p>
                <div className="mt-1.5"><TemperatureBadge profile={item.temperatureProfile} /></div>
              </div>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={()=>updateQty(item.productId,Math.max(1,item.quantity-1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-600">−</button>
                <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                <button onClick={()=>updateQty(item.productId,item.quantity+1)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-600">+</button>
              </div>
              <p className="text-sm font-bold text-gray-900 w-24 text-right">{formatCurrency(item.unitPriceNgn*item.quantity)}</p>
              <button onClick={()=>removeItem(item.productId)} className="text-gray-300 hover:text-red-400 transition-colors">✕</button>
            </div>
          ))}
        </div>
      ))}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Order total</p>
          <p className="text-2xl font-black text-gray-900">{formatCurrency(total())}</p>
        </div>
        <Button size="lg" onClick={()=>router.push("/checkout")}>Proceed to checkout →</Button>
      </div>
    </div>
  );
}
