"use client";
import { useState } from "react";
import { MOCK_INVENTORY } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TemperatureBadge } from "@/components/shared/TemperatureBadge";
import { getExpiryAlertLevel, EXPIRY_COLOURS, formatDate } from "@/lib/utils";
import { STOCK_STYLES } from "@/lib/constants";
import Link from "next/link";
import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { Card3D } from "@/components/shared/Card3D";
import { Package, Plus } from "lucide-react";

type Filter = "all" | "zero" | "low" | "expiry";

export default function InventoryPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const items = MOCK_INVENTORY.filter(i => {
    if (filter === "zero")   return i.reorder_status === "zero";
    if (filter === "low")    return ["low","critical"].includes(i.reorder_status);
    if (filter === "expiry") return getExpiryAlertLevel(i.expiry_date) !== "ok";
    return true;
  });

  const filters: { key: Filter; label: string }[] = [
    { key:"all",    label:`All items (${MOCK_INVENTORY.length})`},
    { key:"zero",   label:`Out of stock (${MOCK_INVENTORY.filter(i=>i.reorder_status==="zero").length})`},
    { key:"low",    label:`Low stock (${MOCK_INVENTORY.filter(i=>["low","critical"].includes(i.reorder_status)).length})`},
    { key:"expiry", label:`Near expiry (${MOCK_INVENTORY.filter(i=>getExpiryAlertLevel(i.expiry_date)!=="ok").length})`},
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Upgraded Cohesive Header */}
      <ModuleHeader
        icon={<Package size={28} className="text-white drop-shadow-sm" />}
        title="Zytrak Inventory"
        tagline="Real-time stock tracking and expiration monitoring"
        gradient="bg-gradient-to-br from-blue-600 to-blue-900"
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Upgraded Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${ 
                filter === f.key 
                ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                : "bg-white border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200" 
              }`}>
              {f.label}
            </button>
          ))}
        </div>
        
        {/* Upgraded Action Button */}
        <Link href="/inventory/receive">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2 rounded-xl">
            <Plus size={16} /> Receive stock
          </Button>
        </Link>
      </div>

      {/* Upgraded Table Container */}
      <Card3D noPad className="overflow-hidden bg-white shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>{["Product","NAFDAC #","Temperature","Stock","Reorder at","Expiry",""].map(h=>(
                <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map(item => {
                const el = getExpiryAlertLevel(item.expiry_date);
                return (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-gray-900">{item.product_name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.category} · {item.location}</p>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{item.nafdac_number}</td>
                    <td className="px-5 py-3.5"><TemperatureBadge profile={item.temperature_profile} /></td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${STOCK_STYLES[item.reorder_status]}`}>
                        {item.current_quantity} {item.unit}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-sm font-medium">{item.reorder_point} {item.unit}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-md font-bold ${EXPIRY_COLOURS[el]}`}>
                        {formatDate(item.expiry_date)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link href="/products">
                        <Button size="sm" className="bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white shadow-none transition-colors border-none">
                          Reorder
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {items.length === 0 && (
          <div className="text-center py-12 bg-gray-50/30">
            <Package size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No items match this filter</p>
          </div>
        )}
      </Card3D>
    </div>
  );
}