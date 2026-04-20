'use client';

import { useState } from 'react';
import { writeProvenanceRecord }                   from '@/lib/stellar';
import { ModuleHeader }                            from '@/components/shared/ModuleHeader';
import { Card3D }                                  from '@/components/shared/Card3D';
import { StellarBadge }                            from '@/components/shared/StellarBadge';
import { SpendChart }                              from '@/components/insights/SpendChart';
import { SupplyHealthScore }                       from '@/components/insights/SupplyHealthScore';
import {
  MOCK_MONTHLY_SPEND,
  MOCK_STOCKOUT_RISK,
  type StockoutRisk,
  type MonthlySpend,
} from '@/lib/mock-data';
import toast from 'react-hot-toast';

export default function InsightsDashboardPage() {
  const [loading,     setLoading]     = useState(false);
  const [explorerUrl, setExplorerUrl] = useState<string | null>(null);

  const handlePublishSnapshot = async () => {
    setLoading(true);
    const t = toast.loading('Publishing supply index to Stellar blockchain…');

    const record = await writeProvenanceRecord(
      'supply_index_snapshot',
      `snapshot-${Date.now()}`,
      {
        period:               new Date().toISOString().slice(0, 7),
        active_labs:          47,
        total_orders:         312,
        gmv_ngn:              4_820_000,
        avg_fill_rate_pct:    94.2,
        cold_chain_compliance:97.1,
        stockout_products:    MOCK_STOCKOUT_RISK.filter(r => r.risk === 'critical').length,
        supply_health_score:  87,
        published_by:         'Zytrak Platform',
      }
    );

    toast.dismiss(t);

    if (record) {
      setExplorerUrl(record.explorerUrl);
      toast.success('Supply index snapshot recorded on Stellar.');
    } else {
      toast.error('Stellar write failed.');
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon="📊"
        title="Zytrak Insights"
        tagline="Verifiable supply chain intelligence — blockchain-stamped for governments and funders"
        gradient="from-insight to-insight-dark"
        stats={[
          { label: 'Active labs',    value: '47'   },
          { label: 'Orders tracked', value: '312'  },
          { label: 'Data integrity', value: '100%' },
        ]}
      />

      {/* Score + Spend chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card3D accent="border-t-insight" className="flex flex-col items-center justify-center py-6">
          <SupplyHealthScore score={87} label="Supply Health Index" size={140} />
          <p className="text-xs text-gray-400 text-center mt-3 max-w-40">
            Computed from 312 verified Stellar procurement records
          </p>
        </Card3D>

        <Card3D accent="border-t-insight" className="md:col-span-2">
          <h2 className="font-bold text-gray-900 mb-3 text-sm">
            Monthly procurement spend
          </h2>
          <SpendChart data={MOCK_MONTHLY_SPEND} color="#0E7490" />
        </Card3D>
      </div>

      {/* Stockout risk table */}
      <Card3D>
        <h2 className="font-bold text-gray-900 mb-3 text-sm">
          Stockout risk — platform-wide
        </h2>
        <div className="space-y-2">
          {MOCK_STOCKOUT_RISK.map((item: StockoutRisk, i: number) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
            >
              <span className={`
                inline-flex items-center justify-center w-6 h-6
                rounded-full text-xs font-bold shrink-0
                ${item.risk === 'critical' ? 'bg-red-100 text-red-700'
                : item.risk === 'warning'  ? 'bg-amber-100 text-amber-700'
                :                            'bg-green-100 text-green-700'}
              `}>
                {item.risk === 'critical' ? '!' : item.risk === 'warning' ? '~' : '✓'}
              </span>

              <p className="text-sm text-gray-800 flex-1">{item.product_name}</p>

              <span className={`
                text-xs font-semibold shrink-0
                ${item.risk === 'critical' ? 'text-red-600'
                : item.risk === 'warning'  ? 'text-amber-600'
                :                            'text-green-600'}
              `}>
                {item.current_stock === 0
                  ? 'Out of stock'
                  : `${item.days_until_stockout}d remaining`}
              </span>
            </div>
          ))}
        </div>
      </Card3D>

      {/* Blockchain publish */}
      <Card3D accent="border-t-insight">
        <h2 className="font-bold text-gray-900 mb-1 text-sm">
          Publish supply index to blockchain
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Writes a cryptographic snapshot of this dashboard to Stellar.
          Any government agency, NGO, or health funder can verify the data
          independently without logging into Zytrak.
        </p>

        {explorerUrl ? (
          <div className="space-y-3">
            <StellarBadge
              explorerUrl={explorerUrl}
              label="Supply index snapshot on-chain ↗"
            />
            <p className="text-xs text-gray-400">
              The SHA-256 hash of all dashboard metrics is stored on
              Stellar — tamperproof and independently auditable.
            </p>
          </div>
        ) : (
          <button
            onClick={handlePublishSnapshot}
            disabled={loading}
            className="
              w-full btn-3d bg-insight text-white
              py-3 rounded-xl text-sm font-bold
              flex items-center justify-center gap-2
              disabled:opacity-50
            "
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Publishing to Stellar…
              </>
            ) : (
              <>🔗 Publish snapshot to Stellar blockchain</>
            )}
          </button>
        )}
      </Card3D>
    </div>
  );
}