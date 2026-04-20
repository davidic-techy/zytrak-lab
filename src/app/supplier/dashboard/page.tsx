"use client";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { useOrderStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default function SupplierDashboard() {
  const { statuses } = useOrderStore();
  const myOrders = MOCK_ORDERS.filter(o => o.supplier_name === "MedTech Solutions Ltd");
  const pending  = myOrders.filter(o => (statuses[o.id]??o.status) === "paid");
  const revenue  = myOrders.filter(o => (statuses[o.id]??o.status) === "confirmed_good")
                           .reduce((s,o) => s + o.total_amount_ngn, 0);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Supplier dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:"Pending orders", value: pending.length,       note:"Awaiting confirmation" },
          { label:"Revenue (completed)", value: formatCurrency(revenue), note:"This period" },
          { label:"Total orders", value: myOrders.length, note:"All time" },
        ].map(c=>(
          <div key={c.label} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <p className="text-3xl font-black text-gray-900">{c.value}</p>
            <p className="text-sm font-semibold text-gray-700 mt-1">{c.label}</p>
            <p className="text-xs text-gray-400">{c.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}