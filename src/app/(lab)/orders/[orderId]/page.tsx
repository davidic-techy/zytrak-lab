"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { useOrderStore } from "@/lib/store";
import { writeProvenanceRecord } from "@/lib/stellar";
import { OrderStatusTimeline } from "@/components/shared/OrderStatusTimeline";
import { StellarBadge } from "@/components/shared/StellarBadge";
import { TemperatureBadge } from "@/components/shared/TemperatureBadge";
import { NAFDACDisplay } from "@/components/shared/NAFDACDisplay";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDateRelative } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import toast from "react-hot-toast";

// Fallback for orders created during checkout (not in mock data)
const FALLBACK_ORDER = {
  id: "new", supplier_name: "MedTech Solutions Ltd", status: "paid",
  payment_rail: "paystack" as const, total_amount_ngn: 47500,
  created_at: new Date().toISOString(),
  items: [{ product_name:"Giemsa Stain 500mL", quantity:5, unit_price_ngn:8500, temperature_profile:"ambient", nafdac_number:"A7-0234" }],
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const { statuses, stellarRecords, setStatus, addStellarRecord } = useOrderStore();
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [temperature, setTemperature]  = useState("");
  const [confirming, setConfirming]    = useState(false);

  const order = MOCK_ORDERS.find(o => o.id === orderId) ?? { ...FALLBACK_ORDER, id: orderId };
  const currentStatus = statuses[orderId] ?? order.status;
  const records        = stellarRecords[orderId] ?? [];
  const canConfirm     = ["dispatched","delivered","in_transit"].includes(currentStatus);
  const isColdChain    = order.items.some((i: any) => i.temperature_profile !== "ambient");

  const handleConfirmDelivery = async () => {
    if (isColdChain && !temperature) {
      toast.error("Temperature at receipt is required for cold chain products");
      return;
    }
    
    setConfirming(true);
    const loadingToast = toast.loading("Writing delivery confirmation to Stellar blockchain...");

    // 1. Check if the product was compromised during transit (> 8°C)
    const isCompromised = isColdChain && Number(temperature) > 8; 
    const eventType = isCompromised ? "cold_chain_breach" : "goods_receipt";

    // 2. Single call to the blockchain with the dynamic data
    const record = await writeProvenanceRecord(eventType, orderId, {
      order_id:              orderId,
      supplier:              order.supplier_name,
      confirmed_by:          "Dr. Adeyemi",
      facility:              "Lagos Medical Laboratory",
      temperature_at_receipt: temperature || null,
      payment_rail:          order.payment_rail,
      status:                isCompromised ? "REJECTED_SPOILAGE" : "ACCEPTED",
    });

    toast.dismiss(loadingToast);
    setStatus(orderId, "confirmed_good");

    if (record) {
      addStellarRecord(orderId, record as any);
      if (isCompromised) {
        toast.error("Cold chain breach logged permanently on Stellar!");
      } else {
        toast.success("Delivery confirmed! Permanent record created on Stellar.");
      }
    } else {
      toast.success("Delivery confirmed! (Blockchain sync unavailable)");
    }
    
    setShowConfirm(false);
    setConfirming(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order {orderId}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {order.supplier_name} · {formatDateRelative(order.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={order.payment_rail==="stellar" ? "stellar" : "neutral"}>
            {order.payment_rail==="stellar" ? "🔗 USDC / Stellar" : "NGN / Paystack"}
          </Badge>
          <Badge variant={currentStatus==="confirmed_good" ? "success" : currentStatus==="disputed" ? "danger" : "info"}>
            {ORDER_STATUS_LABELS[currentStatus] ?? currentStatus}
          </Badge>
        </div>
      </div>

      {/* Status timeline */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Order status</h2>
        <OrderStatusTimeline currentStatus={currentStatus} />
      </div>

      {/* Items */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-900">Items</h2>
        </div>
        {order.items.map((item: any, i: number) => (
          <div key={i} className="px-5 py-4 border-b border-gray-50 last:border-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{item.product_name}</p>
                <div className="mt-2"><NAFDACDisplay number={item.nafdac_number} /></div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <TemperatureBadge profile={item.temperature_profile} />
                <p className="text-sm font-bold">{item.quantity} × {formatCurrency(item.unit_price_ngn)}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="px-5 py-3 bg-gray-50 flex justify-between font-bold">
          <span>Total</span><span>{formatCurrency(order.total_amount_ngn)}</span>
        </div>
      </div>

      {/* Stellar provenance records */}
      {records.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 space-y-3">
          <h2 className="font-semibold text-gray-900">Blockchain provenance</h2>
          <p className="text-xs text-gray-500">
            These records are permanently written to the Stellar blockchain. They cannot be altered.
          </p>
          {records.map((rec, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {rec.eventType === "cold_chain_breach" ? "⚠️ Spoilage breach recorded on-chain" : "Delivery confirmation recorded on-chain"}
                </p>
                <p className="font-mono text-xs text-gray-400 mt-0.5">{rec.txHash.slice(0,40)}...</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDateRelative(rec.createdAt)}</p>
              </div>
              <StellarBadge explorerUrl={rec.explorerUrl} label="View on Stellar ↗" />
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {canConfirm && currentStatus !== "confirmed_good" && (
        <div className="flex gap-3">
          <Button size="lg" onClick={() => setShowConfirm(true)}>
            ✓ Confirm Delivery
          </Button>
          <Button variant="secondary" size="lg">Raise Dispute</Button>
        </div>
      )}

      {/* Confirm delivery modal */}
      {showConfirm && (
        <ConfirmModal
          title="Confirm delivery"
          message="By confirming, you verify that products have arrived in acceptable condition. This action triggers payment and creates an immutable record on the Stellar blockchain."
          confirmLabel={confirming ? "Writing to blockchain..." : "Confirm & release payment"}
          loading={confirming}
          onConfirm={handleConfirmDelivery}
          onCancel={() => setShowConfirm(false)}
        >
          {isColdChain && (
            <div className="mt-3 space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Temperature at receipt (°C) <span className="text-red-500">*</span>
              </label>
              <input type="number" step="0.1" value={temperature}
                onChange={e => setTemperature(e.target.value)}
                placeholder="e.g. 4.2"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              <p className="text-xs text-gray-400">Required for refrigerated/frozen products. Entering a value &gt; 8°C will flag a spoilage breach.</p>
            </div>
          )}
        </ConfirmModal>
      )}
    </div>
  );
}