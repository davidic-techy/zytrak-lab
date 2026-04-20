'use client';

import Link from 'next/link';
import { formatDateRelative } from '@/lib/utils';
import { TemperatureBadge } from '@/components/shared/TemperatureBadge';
import type { MockShipment, MockOrder } from '@/lib/mock-data';

interface Props {
  shipment: MockShipment;
  order:    MockOrder;
}

function StatusDot({ status }: { status: MockShipment['status'] }) {
  const map = {
    in_transit: { dot: 'bg-blue-500',  ring: 'ring-blue-200',  label: 'In Transit' },
    delivered:  { dot: 'bg-green-500', ring: 'ring-green-200', label: 'Delivered'  },
    delayed:    { dot: 'bg-red-500',   ring: 'ring-red-200',   label: 'Delayed'    },
  };
  const c = map[status];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`
        inline-block w-2 h-2 rounded-full animate-pulse
        ${c.dot} ring-2 ${c.ring}
      `} />
      <span className="text-xs font-medium text-gray-600">{c.label}</span>
    </span>
  );
}

function MiniTempBar({
  readings,
  min = 2,
  max = 8,
}: {
  readings: number[];
  min?: number;
  max?: number;
}) {
  const hasBreaches = readings.some(r => r < min || r > max);
  const allVals     = [...readings, min, max];
  const lo          = Math.min(...allVals);
  const span        = Math.max(...allVals) - lo || 1;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-end gap-0.5 h-6">
        {readings.map((v, i) => {
          const barH    = Math.max(4, ((v - lo) / span) * 22);
          const inRange = v >= min && v <= max;
          return (
            <div
              key={i}
              style={{ height: barH }}
              className={`w-1.5 rounded-sm ${inRange ? 'bg-green-500' : 'bg-red-500'}`}
            />
          );
        })}
      </div>
      {hasBreaches ? (
        <span className="text-xs font-semibold text-red-600">⚠ Breach detected</span>
      ) : (
        <span className="text-xs font-medium text-green-700">✓ Within range</span>
      )}
    </div>
  );
}

export function ShipmentCard({ shipment, order }: Props) {
  const hasColdChain = shipment.cold_chain;
  const tempProfile  = hasColdChain ? 'refrigerated' : 'ambient';
  const lastTemp     = shipment.temp_readings.at(-1) ?? null;

  return (
    <div className="card-3d border-t-4 border-t-logi p-5 space-y-4">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 truncate">{order.supplier_name}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Order <span className="font-mono">{order.id}</span>
          </p>
        </div>
        <StatusDot status={shipment.status} />
      </div>

      {/* Products */}
      <div className="space-y-1">
        {order.items.slice(0, 2).map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">·</span>
            <span className="text-gray-700 truncate">{item.product_name}</span>
            <span className="text-gray-400 text-xs shrink-0">×{item.quantity}</span>
          </div>
        ))}
        {order.items.length > 2 && (
          <p className="text-xs text-gray-400 pl-3">
            +{order.items.length - 2} more items
          </p>
        )}
      </div>

      {/* Logistics grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Waybill',   value: shipment.waybill,                         mono: true  },
          { label: 'Courier',   value: shipment.courier,                          mono: false },
          { label: 'Dispatched',value: formatDateRelative(shipment.dispatch_time),mono: false },
          { label: 'ETA',       value: formatDateRelative(shipment.eta),          accent: true },
        ].map(row => (
          <div key={row.label} className="bg-gray-50 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-400 mb-0.5">{row.label}</p>
            <p className={`
              text-xs font-semibold
              ${row.accent ? 'text-logi' : 'text-gray-800'}
              ${row.mono   ? 'font-mono' : ''}
            `}>
              {row.value}
            </p>
          </div>
        ))}
      </div>

      {/* Temperature */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <TemperatureBadge profile={tempProfile} />
          {hasColdChain && lastTemp !== null && (
            <span className="text-xs text-gray-500">
              Latest:{' '}
              <span className={`font-bold ${
                lastTemp >= 2 && lastTemp <= 8 ? 'text-green-700' : 'text-red-700'
              }`}>
                {lastTemp}°C
              </span>
            </span>
          )}
        </div>
        {hasColdChain && shipment.temp_readings.length > 0 && (
          <MiniTempBar readings={shipment.temp_readings} />
        )}
      </div>

      {/* CTA */}
      <Link href={`/logistics/${order.id}`}>
        <button className="
          w-full btn-3d
          bg-linear-to-r from-logi to-logi-dark
          text-white text-sm font-bold
          py-2.5 rounded-xl
          flex items-center justify-center gap-2
        ">
          <span>🚚</span>
          Track shipment
          <span className="opacity-60 text-xs">→</span>
        </button>
      </Link>
    </div>
  );
}