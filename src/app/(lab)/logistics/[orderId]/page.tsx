'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_SHIPMENTS, MOCK_ORDERS } from '@/lib/mock-data';
import { useOrderStore } from '@/lib/store';
import { OrderStatusTimeline }   from '@/components/shared/OrderStatusTimeline';
import { TemperatureBadge }      from '@/components/shared/TemperatureBadge';
import { StellarBadge }          from '@/components/shared/StellarBadge';
import { Card3D }                from '@/components/shared/Card3D';
import { TempSparkline }         from '@/components/logistics/TempSparkline';
import { ProofOfDeliveryButton } from '@/components/logistics/ProofOfDeliveryButton';
import { formatCurrency, formatDateRelative } from '@/lib/utils';

const SAFE_RANGE: Record<string, { min: number; max: number }> = {
  refrigerated: { min: 2,   max: 8   },
  frozen:       { min: -25, max: -15 },
  ultra_cold:   { min: -85, max: -75 },
  ambient:      { min: 15,  max: 30  },
};

export default function ShipmentDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router      = useRouter();

  const { statuses, stellarRecords } = useOrderStore();

  const shipment = MOCK_SHIPMENTS.find(s => s.order_id === orderId);
  const order    = MOCK_ORDERS.find(o => o.id === orderId);

  const [temperature, setTemperature] = useState('');
  const [tempError,   setTempError]   = useState('');

  const currentStatus = statuses[orderId] ?? order?.status ?? 'in_transit';
  const stellarProofs = stellarRecords[orderId] ?? [];
  const canConfirmPoD = ['in_transit', 'dispatched', 'delivered'].includes(currentStatus)
    && currentStatus !== 'confirmed_good';

  const hasColdChain  = shipment?.cold_chain ?? false;
  const tempProfile   = hasColdChain ? 'refrigerated' : 'ambient';
  const safeRange     = SAFE_RANGE[tempProfile];
  const readings      = shipment?.temp_readings ?? [];
  const hasBreaches   = readings.some(r => r < safeRange.min || r > safeRange.max);
  const latestReading = readings.at(-1) ?? null;

  const handleTempChange = (val: string) => {
    setTemperature(val);
    const num = parseFloat(val);
    if (val && isNaN(num))          setTempError('Enter a valid number');
    else if (num < -100 || num > 100) setTempError('Must be between −100 and +100°C');
    else                             setTempError('');
  };

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-6xl mb-4">📦</p>
        <h2 className="text-xl font-bold text-gray-900">Order not found</h2>
        <p className="text-sm text-gray-500 mt-1">
          Order <span className="font-mono">{orderId}</span> does not exist.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-5 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          ← Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-5">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link href="/logistics" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
          ← Back to logistics
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-700">
          Order <span className="font-mono text-logi">{orderId}</span>
        </span>
      </div>

      {/* Title + breach warning */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Shipment detail</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {order.supplier_name} · {formatDateRelative(order.created_at)}
          </p>
        </div>
        {hasBreaches && hasColdChain && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 shrink-0">
            <span>⚠️</span>
            <span className="text-xs font-bold text-red-700">Temperature breach</span>
          </div>
        )}
      </div>

      {/* Status timeline */}
      <Card3D accent="border-t-logi">
        <h2 className="font-bold text-gray-900 mb-4 text-sm">Order status</h2>
        <OrderStatusTimeline currentStatus={currentStatus} />
      </Card3D>

      {/* Courier info */}
      {shipment && (
        <Card3D>
          <h2 className="font-bold text-gray-900 mb-3 text-sm">Courier information</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Courier',           value: shipment.courier,                          mono: false, accent: false },
              { label: 'Waybill',           value: shipment.waybill,                          mono: true,  accent: false },
              { label: 'Dispatched',        value: formatDateRelative(shipment.dispatch_time), mono: false, accent: false },
              { label: 'Expected delivery', value: formatDateRelative(shipment.eta),           mono: false, accent: true  },
            ].map(row => (
              <div key={row.label} className="bg-gray-50 rounded-xl px-3 py-2.5">
                <p className="text-xs text-gray-400 mb-0.5">{row.label}</p>
                <p className={`
                  text-sm font-semibold
                  ${row.accent ? 'text-logi' : 'text-gray-800'}
                  ${row.mono   ? 'font-mono text-xs' : ''}
                `}>
                  {row.value}
                </p>
              </div>
            ))}
          </div>

          {/* Cold-chain status pill */}
          {hasColdChain && (
            <div className={`
              mt-3 flex items-center gap-2 px-3 py-2 rounded-lg
              ${hasBreaches
                ? 'bg-red-50 border border-red-200'
                : 'bg-green-50 border border-green-200'}
            `}>
              <span>{hasBreaches ? '❌' : '✅'}</span>
              <span className={`text-xs font-semibold ${hasBreaches ? 'text-red-700' : 'text-green-700'}`}>
                {hasBreaches
                  ? `Cold chain breached — reading(s) outside ${safeRange.min}–${safeRange.max}°C`
                  : `Cold chain maintained — all readings within ${safeRange.min}–${safeRange.max}°C`}
              </span>
              {latestReading !== null && (
                <span className="text-xs text-gray-500 ml-auto">
                  Latest:{' '}
                  <span className={`font-bold ${
                    latestReading >= safeRange.min && latestReading <= safeRange.max
                      ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {latestReading}°C
                  </span>
                </span>
              )}
            </div>
          )}
        </Card3D>
      )}

      {/* Full temperature chart */}
      {hasColdChain && readings.length > 0 && (
        <Card3D accent="border-t-blue-400">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-sm">Cold chain temperature log</h2>
            <TemperatureBadge profile={tempProfile} />
          </div>
          <TempSparkline
            readings={readings}
            minSafe={safeRange.min}
            maxSafe={safeRange.max}
            width={520}
            height={100}
          />
          <p className="text-xs text-gray-400 mt-2">
            {readings.length} reading{readings.length === 1 ? '' : 's'} recorded ·
            Safe range: {safeRange.min}–{safeRange.max}°C
          </p>
        </Card3D>
      )}

      {/* Items list */}
      <Card3D noPad>
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-gray-900 text-sm">Items in this shipment</h2>
        </div>
        {order.items.map((item, i) => (
          <div
            key={i}
            className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{item.product_name}</p>
              <p className="font-mono text-xs text-gray-400 mt-0.5">{item.nafdac_number}</p>
            </div>
            <TemperatureBadge profile={item.temperature_profile} />
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-gray-900">
                {item.quantity} × {formatCurrency(item.unit_price_ngn)}
              </p>
              <p className="text-xs text-gray-400">
                {formatCurrency(item.unit_price_ngn * item.quantity)}
              </p>
            </div>
          </div>
        ))}
        <div className="px-5 py-3 bg-gray-50 flex justify-between font-bold text-sm">
          <span className="text-gray-700">Order total</span>
          <span className="text-gray-900">{formatCurrency(order.total_amount_ngn)}</span>
        </div>
      </Card3D>

      {/* Proof of delivery */}
      {canConfirmPoD && (
        <Card3D accent="border-t-logi">
          <h2 className="font-bold text-gray-900 mb-1 text-sm">Confirm delivery</h2>
          <p className="text-xs text-gray-500 mb-4">
            Writes a permanent proof of delivery to the Stellar blockchain — GPS coordinates,
            timestamp, and temperature at receipt.
          </p>

          {hasColdChain && (
            <div className="mb-4 space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Temperature at receipt (°C){' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={temperature}
                onChange={e => handleTempChange(e.target.value)}
                placeholder={`Safe range: ${safeRange.min}–${safeRange.max}°C`}
                className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-logi border-gray-200"
              />
              {tempError && (
                <p className="text-xs text-red-600">{tempError}</p>
              )}
              {temperature && !tempError && (
                <p className={`text-xs font-semibold ${
                  parseFloat(temperature) >= safeRange.min && parseFloat(temperature) <= safeRange.max
                    ? 'text-green-700' : 'text-amber-600'
                }`}>
                  {parseFloat(temperature) >= safeRange.min && parseFloat(temperature) <= safeRange.max
                    ? `✓ ${temperature}°C — within safe range`
                    : `⚠ ${temperature}°C — outside safe range. Proceed only if products are verified as viable.`
                  }
                </p>
              )}
            </div>
          )}

          <ProofOfDeliveryButton
            orderId={orderId}
            temperature={temperature && !tempError ? parseFloat(temperature) : undefined}
            courierName={shipment?.courier}
          />

          <div className="mt-3 flex items-start gap-2 bg-logi/5 rounded-lg px-3 py-2">
            <span className="shrink-0">🔗</span>
            <p className="text-xs text-gray-600">
              Real transaction on <strong>Stellar Testnet</strong> via Soroban.
              Cannot be altered or deleted after submission.
            </p>
          </div>
        </Card3D>
      )}

      {/* Stellar provenance records */}
      {stellarProofs.length > 0 && (
        <Card3D>
          <h2 className="font-bold text-gray-900 mb-1 text-sm">Blockchain provenance</h2>
          <p className="text-xs text-gray-500 mb-4">
            Click any badge to verify independently in Stellar Explorer.
          </p>
          <div className="space-y-3">
            {stellarProofs.map((rec, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-3 py-3 border-b border-gray-50 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {rec.eventType === 'proof_of_delivery' ? 'Proof of delivery recorded'
                     : rec.eventType === 'goods_receipt'   ? 'Goods receipt confirmed'
                     : rec.eventType}
                  </p>
                  <p className="font-mono text-xs text-gray-400 mt-0.5 truncate">
                    {rec.txHash}
                  </p>
                  <p className="text-xs text-gray-400">{formatDateRelative(rec.createdAt)}</p>
                </div>
                <StellarBadge explorerUrl={rec.explorerUrl} label="View ↗" />
              </div>
            ))}
          </div>
        </Card3D>
      )}

      {/* Already confirmed — no stellar proof */}
      {currentStatus === 'confirmed_good' && stellarProofs.length === 0 && (
        <Card3D>
          <div className="flex items-center gap-3 text-green-700">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold">Delivery confirmed</p>
              <p className="text-xs opacity-75">Payment released to supplier.</p>
            </div>
          </div>
        </Card3D>
      )}
    </div>
  );
}