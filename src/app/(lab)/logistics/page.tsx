'use client';

import { useMemo } from 'react';
import { MOCK_SHIPMENTS, MOCK_ORDERS } from '@/lib/mock-data';
import { ModuleHeader }  from '@/components/shared/ModuleHeader';
import { ShipmentCard }  from '@/components/logistics/ShipmentCard';
import { EmptyState }    from '@/components/ui/EmptyState';

export default function LogisticsPage() {
  const shipments = useMemo(() =>
    MOCK_SHIPMENTS.map(s => ({
      shipment: s,
      order:    MOCK_ORDERS.find(o => o.id === s.order_id),
    })).filter(x => !!x.order),
    []
  );

  const inTransit   = shipments.filter(x => x.shipment.status === 'in_transit');
  const coldChain   = shipments.filter(x => x.shipment.cold_chain);
  const breachCount = shipments.filter(x =>
    x.shipment.temp_readings.some(r => r < 2 || r > 8)
  ).length;

  return (
    <div className="space-y-6">

      <ModuleHeader
        icon="🚚"
        title="Zytrak Logistics"
        tagline="Real-time shipment tracking — every delivery provable on Stellar"
        gradient="from-logi to-logi-dark"
        stats={[
          { label: 'In transit',    value: String(inTransit.length) },
          { label: 'Cold chain',    value: String(coldChain.length) },
          { label: 'Temp breaches', value: breachCount === 0 ? 'None' : String(breachCount) },
        ]}
      />

      {/* Active shipments */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">Active shipments</h2>
          <span className="text-xs text-gray-500">{inTransit.length} in transit</span>
        </div>

        {inTransit.length === 0 ? (
          <EmptyState
            title="No active shipments"
            description="Shipments appear here once suppliers dispatch your orders."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inTransit.map(({ shipment, order }) => (
              <ShipmentCard key={shipment.id} shipment={shipment} order={order!} />
            ))}
          </div>
        )}
      </section>

      {/* Recent deliveries table */}
      {shipments.some(x => x.shipment.status !== 'in_transit') && (
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">Recent deliveries</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Shipment', 'Supplier', 'Waybill', 'Courier', 'Status', 'Cold chain'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {shipments
                  .filter(x => x.shipment.status !== 'in_transit')
                  .map(({ shipment, order }) => (
                    <tr key={shipment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{shipment.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{order!.supplier_name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{shipment.waybill}</td>
                      <td className="px-4 py-3 text-gray-600">{shipment.courier}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Delivered
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {shipment.cold_chain
                          ? <span className="text-xs text-blue-700 font-semibold">❄ Cold chain</span>
                          : <span className="text-xs text-gray-400">Ambient</span>
                        }
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}