"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { useOrderStore, type OrderStatus } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { TemperatureBadge } from "@/components/shared/TemperatureBadge";
import { OrderStatusTimeline } from "@/components/shared/OrderStatusTimeline";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

// Only valid next transitions — matches backend exactly
const NEXT: Record<string,OrderStatus> = {
  paid:"confirmed", confirmed:"packed", packed:"dispatched", dispatched:"delivered"
};
const NEXT_LABEL: Record<string,string> = {
  paid:"Confirm order", confirmed:"Mark as packed", packed:"Mark as dispatched", dispatched:"Mark as delivered"
};

export default function SupplierOrderDetail() {
  const { orderId } = useParams<{orderId:string}>();
  const { statuses, setStatus } = useOrderStore();
  const order = MOCK_ORDERS.find(o=>o.id===orderId) ?? MOCK_ORDERS[0];
  const currentStatus = statuses[orderId] ?? order.status;
  const [loading, setLoading] = useState(false);

  const advance = async () => {
    const next = NEXT[currentStatus];
    if (!next) return;
    setLoading(true);
    await new Promise(r=>setTimeout(r,800));
    setStatus(orderId, next);
    toast.success(NEXT_LABEL[currentStatus]);
    setLoading(false);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Order {orderId}</h1>
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
        <OrderStatusTimeline currentStatus={currentStatus} />
      </div>
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {order.items.map((item:any,i:number)=>(
          <div key={i} className="px-5 py-3 border-b border-gray-50 last:border-0 flex items-center gap-4">
            <div className="flex-1"><p className="font-semibold">{item.product_name}</p></div>
            <TemperatureBadge profile={item.temperature_profile} />
            <p className="text-sm font-bold">{item.quantity} × {formatCurrency(item.unit_price_ngn)}</p>
          </div>
        ))}
        <div className="px-5 py-3 bg-gray-50 flex justify-between font-bold">
          <span>Total</span><span>{formatCurrency(order.total_amount_ngn)}</span>
        </div>
      </div>
      {NEXT[currentStatus] && (
        <Button loading={loading} onClick={advance} size="lg">
          {NEXT_LABEL[currentStatus]}
        </Button>
      )}
    </div>
  );
}
