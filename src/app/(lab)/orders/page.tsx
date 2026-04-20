"use client";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { useOrderStore } from "@/lib/store";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatCurrency, formatDateRelative } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { Card3D } from "@/components/shared/Card3D";
import { ClipboardList } from "lucide-react";

function statusVariant(s: string) {
  if (s === "confirmed_good") return "success";
  if (s === "disputed")       return "danger";
  if (s === "paid")           return "info";
  return "neutral";
}

export default function OrdersPage() {
  const { statuses } = useOrderStore();
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Upgraded Cohesive Header */}
      <ModuleHeader
        icon={<ClipboardList size={28} className="text-white drop-shadow-sm" />}
        title="Zytrak Orders"
        tagline="Track and manage your procurement pipeline"
        gradient="bg-gradient-to-br from-blue-600 to-blue-900"
      />

      {/* Upgraded Table Container */}
      <Card3D noPad className="overflow-hidden bg-white shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>{["Order","Supplier","Total","Payment","Status","Date",""].map(h=>(
                <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_ORDERS.map(order => {
                const status = statuses[order.id] ?? order.status;
                return (
                  <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{order.id}</td>
                    <td className="px-5 py-3.5 font-bold text-gray-900">{order.supplier_name}</td>
                    <td className="px-5 py-3.5 font-bold text-gray-900">{formatCurrency(order.total_amount_ngn)}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={order.payment_rail==="stellar" ? "stellar" : "neutral"}>
                        {order.payment_rail==="stellar" ? "🔗 USDC/Stellar" : "NGN/Paystack"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={statusVariant(status)}>{ORDER_STATUS_LABELS[status]??status}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs font-medium">{formatDateRelative(order.created_at)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <Link href={`/orders/${order.id}`}>
                        <Button size="sm" className="bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white shadow-none transition-colors border-none">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {MOCK_ORDERS.length === 0 && (
            <div className="text-center py-12 bg-gray-50/30">
              <ClipboardList size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No orders found.</p>
            </div>
          )}
        </div>
      </Card3D>
    </div>
  );
}