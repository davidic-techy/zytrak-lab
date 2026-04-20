'use client';

import Link from 'next/link';
import { ShieldCheck, AlertTriangle, Package, Clock, Home } from 'lucide-react';
import { MOCK_INVENTORY, MOCK_SUPPLIERS, MOCK_ORDERS } from '@/lib/mock-data';
import { useSupplierStore } from '@/lib/store';
import { getExpiryAlertLevel, EXPIRY_COLOURS, formatCurrency, formatDateRelative } from '@/lib/utils';
import { VerifiedSupplierBadge } from '@/components/shared/VerifiedSupplierBadge';
import { StellarBadge }          from '@/components/shared/StellarBadge';
import { Button }                from '@/components/ui/Button';
import { Badge }                 from '@/components/ui/Badge';
import { ModuleHeader }          from '@/components/shared/ModuleHeader';

export default function Dashboard() {
  const { approved } = useSupplierStore();

  // Inventory alerts
  const zero     = MOCK_INVENTORY.filter(i => i.reorder_status === 'zero');
  const low      = MOCK_INVENTORY.filter(i => i.reorder_status === 'low' || i.reorder_status === 'critical');
  const expiring = MOCK_INVENTORY.filter(i => getExpiryAlertLevel(i.expiry_date) !== 'ok');

  // Supplier verification status — reads live from Zustand
  const verifiedSuppliers   = MOCK_SUPPLIERS.filter(s => !!approved[s.id]);
  const unverifiedSuppliers = MOCK_SUPPLIERS.filter(s => !approved[s.id]);
  const newlyVerified       = MOCK_SUPPLIERS.filter(
    s => approved[s.id]?.approvedAt && approved[s.id].explorerUrl
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Upgraded Cohesive Blue Header */}
      <ModuleHeader
        icon={<Home size={28} className="text-white drop-shadow-sm" />}
        title="Good morning, Dr. Adeyemi"
        tagline={`Lagos Medical Laboratory · ${new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}`}
        gradient="bg-gradient-to-br from-blue-600 to-blue-900"
        stats={
          verifiedSuppliers.length > 0 
            ? [{ label: "Verified Partners", value: `${verifiedSuppliers.length} / ${MOCK_SUPPLIERS.length}` }]
            : undefined
        }
      />

      {/* ── Newly verified suppliers alert ── */}
      {/* This section only renders after admin approves — real-time Zustand update */}
      {newlyVerified.length > 0 && (
        <div className="bg-blue-600 rounded-2xl p-4 text-white shadow-sm border border-blue-500">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">
                {newlyVerified.length === 1
                  ? `${newlyVerified[0].name} is now blockchain verified`
                  : `${newlyVerified.length} suppliers are now blockchain verified`}
              </p>
              <p className="text-xs opacity-75 mt-0.5">
                Their NAFDAC credentials have been recorded on Stellar Testnet.
                You can now order from them with full trust.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {newlyVerified.map(s => (
                  <div key={s.id} className="flex items-center gap-2">
                    {approved[s.id]?.explorerUrl && (
                      <StellarBadge
                        explorerUrl={approved[s.id].explorerUrl}
                        label={`${s.name.split(' ')[0]} on-chain ↗`}
                      />
                    )}
                  </div>
                ))}
                <Link href="/verify">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20 text-white hover:bg-white/30 transition-colors">
                    View all verifications →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Inventory alert cards ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label:   'Out of stock',
            count:   zero.length,
            bg:      'bg-red-50 border-red-100',
            text:    'text-red-800',
            numText: 'text-red-700',
            icon:    <Package size={16} className="text-red-500" />,
          },
          {
            label:   'Low stock',
            count:   low.length,
            bg:      'bg-amber-50 border-amber-100',
            text:    'text-amber-800',
            numText: 'text-amber-700',
            icon:    <AlertTriangle size={16} className="text-amber-500" />,
          },
          {
            label:   'Near expiry',
            count:   expiring.length,
            bg:      'bg-yellow-50 border-yellow-100',
            text:    'text-yellow-800',
            numText: 'text-yellow-700',
            icon:    <Clock size={16} className="text-yellow-500" />,
          },
        ].map(c => (
          <div key={c.label} className={`rounded-2xl border p-5 shadow-sm transition-transform hover:-translate-y-0.5 ${c.bg}`}>
            <div className={`text-4xl font-black drop-shadow-sm ${c.numText}`}>{c.count}</div>
            <div className={`flex items-center gap-2 mt-2 opacity-90 text-sm font-bold tracking-tight ${c.text}`}>
              {c.icon}
              {c.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Main content: two columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Items needing attention */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-bold text-gray-900 text-sm tracking-tight">Items needing attention</h2>
            <Link href="/inventory">
              <Button variant="ghost" size="sm" className="text-blue-700 hover:text-blue-800 hover:bg-blue-50">View all →</Button>
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {[...zero, ...low].slice(0, 5).map(item => (
              <div key={item.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {item.product_name}
                  </p>
                  <p className="font-mono text-xs text-gray-500 mt-0.5">{item.nafdac_number}</p>
                </div>
                <Badge variant={item.reorder_status === 'zero' ? 'danger' : 'warning'}>
                  {item.reorder_status === 'zero'
                    ? 'Out of stock'
                    : `${item.current_quantity} left`}
                </Badge>
                <Link href="/products">
                  <Button size="sm" className="bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white shadow-none transition-colors border-none">
                    Reorder
                  </Button>
                </Link>
              </div>
            ))}
            {zero.length === 0 && low.length === 0 && (
              <div className="px-5 py-12 text-center">
                <Package size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-500">
                  All stock levels are healthy ✓
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Supplier trust panel — live from useSupplierStore ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h2 className="font-bold text-gray-900 text-sm tracking-tight">Supplier trust status</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {verifiedSuppliers.length} of {MOCK_SUPPLIERS.length} verified on Stellar
              </p>
            </div>
            <Link href="/verify">
              <Button variant="ghost" size="sm" className="text-blue-700 hover:text-blue-800 hover:bg-blue-50">View Verify →</Button>
            </Link>
          </div>

          {/* Progress bar */}
          <div className="px-5 pt-4 pb-2">
            <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-1.5">
              <span>Verification progress</span>
              <span className="font-bold text-blue-600">
                {verifiedSuppliers.length}/{MOCK_SUPPLIERS.length} verified
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-700 shadow-sm"
                style={{
                  width: `${(verifiedSuppliers.length / MOCK_SUPPLIERS.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Supplier list */}
          <div className="divide-y divide-gray-50 px-5">
            {MOCK_SUPPLIERS.map(supplier => {
              const state      = approved[supplier.id];
              const isVerified = !!state;
              const hasOnChain = isVerified && !!state.explorerUrl;

              return (
                <div
                  key={supplier.id}
                  className="flex items-center gap-3 py-3 hover:bg-gray-50/30 transition-colors"
                >
                  {/* Status dot — animates to blue when verified */}
                  <div className={`
                    w-2.5 h-2.5 rounded-full shrink-0 transition-colors duration-500 shadow-sm
                    ${isVerified ? 'bg-blue-600' : 'bg-gray-200'}
                  `} />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {supplier.name}
                    </p>
                    <p className="font-mono text-xs text-gray-500 mt-0.5">
                      {supplier.nafdac_licence}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <VerifiedSupplierBadge
                      supplierId={supplier.id}
                      variant="compact"
                    />
                    {/* Show real Stellar link the moment it exists */}
                    {hasOnChain && (
                      <StellarBadge
                        explorerUrl={state.explorerUrl}
                        label="On-chain ↗"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Unverified warning */}
          {unverifiedSuppliers.length > 0 && (
            <div className="mx-5 mb-4 mt-2 flex items-start gap-2 bg-amber-50/80 border border-amber-100 rounded-xl px-3 py-2.5">
              <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800">
                <span className="font-bold">
                  {unverifiedSuppliers.length} supplier
                  {unverifiedSuppliers.length !== 1 ? 's' : ''} pending
                </span>{' '}
                — an admin needs to approve them from the Suppliers page.
                Until verified, you can still order but without blockchain
                credential proof.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Recent orders ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-gray-900 text-sm tracking-tight">Recent orders</h2>
          <Link href="/orders">
            <Button variant="ghost" size="sm" className="text-blue-700 hover:text-blue-800 hover:bg-blue-50">View all →</Button>
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {MOCK_ORDERS.slice(0, 3).map(order => {
            const supplierApproved = !!approved[
              MOCK_SUPPLIERS.find(s => s.name === order.supplier_name)?.id ?? ''
            ];
            return (
              <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {order.supplier_name}
                    </p>
                    {/* Verification badge inline on order row */}
                    {supplierApproved && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 uppercase tracking-wide">
                        <ShieldCheck size={10} />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    {order.id} <span className="mx-1 opacity-50">·</span> {formatDateRelative(order.created_at)}
                  </p>
                </div>
                <p className="text-sm font-black text-gray-900 shrink-0 tracking-tight">
                  {formatCurrency(order.total_amount_ngn)}
                </p>
                <Badge variant={
                  order.status === 'confirmed_good' ? 'success'
                  : order.status === 'dispatched'   ? 'info'
                  : 'neutral'
                }>
                  {order.status.replace('_', ' ')}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}