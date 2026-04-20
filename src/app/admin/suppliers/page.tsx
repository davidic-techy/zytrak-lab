'use client';

import { useState } from 'react';
import { CheckCircle, ShieldCheck } from 'lucide-react'; // FIXED: Added ShieldCheck here
import { MOCK_SUPPLIERS }       from '@/lib/mock-data';
import { useSupplierStore }     from '@/lib/store';
import { writeProvenanceRecord } from '@/lib/stellar';
import { Card3D }               from '@/components/shared/Card3D';
import { TrustBadge }           from '@/components/shared/TrustBadge';
import { StellarBadge }         from '@/components/shared/StellarBadge';
import toast from 'react-hot-toast';

export default function AdminSuppliersPage() {
  const { approved, approveSupplier } = useSupplierStore();
  const [loading, setLoading]         = useState<string | null>(null);

  const handleApprove = async (
    supplierId:   string,
    supplierName: string,
    nafdacLicence: string,
  ) => {
    setLoading(supplierId);
    const t = toast.loading(
      `Writing ${supplierName} credentials to Stellar blockchain…`
    );

    // REAL Stellar transaction — manageData on testnet
    const record = await writeProvenanceRecord(
      'supplier_approved',
      supplierId,
      {
        supplier_name:  supplierName,
        nafdac_licence: nafdacLicence,
        approved_by:    'Zytrak Platform Admin',
        platform:       'Zytrak',
      }
    );

    toast.dismiss(t);

    if (record) {
      // explorerUrl stored in Zustand — supplier profile page reads it
      approveSupplier(supplierId, record.explorerUrl);
      toast.success(`${supplierName} approved. Credentials on Stellar.`);
    } else {
      // Approve anyway even if Stellar write fails
      approveSupplier(supplierId, '');
      toast.success(`${supplierName} approved.`);
    }

    setLoading(null);
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-mp-navy">Supplier management</h1>
        <p className="text-sm text-mp-muted mt-1">
          Approving a supplier writes their NAFDAC credentials permanently to
          the Stellar blockchain. The record is publicly verifiable.
        </p>
      </div>

      <div className="space-y-3">
        {MOCK_SUPPLIERS.map(supplier => {
          const state      = approved[supplier.id];
          const isApproved = !!state;
          const hasOnChain = isApproved && !!state.explorerUrl;

          return (
            <Card3D
              key={supplier.id}
              className={`border transition-colors ${
                isApproved
                  ? 'border-mp-green/20 bg-mp-green-lt/30'
                  : 'border-mp-border'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-bold text-mp-navy">{supplier.name}</p>
                    <TrustBadge
                      level={
                        isApproved
                          ? 'verified'
                          : (supplier.trust_level as any) ?? 'pending'
                      }
                    />
                  </div>
                  <p className="text-xs text-mp-muted">{supplier.state}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs text-mp-muted">NAFDAC:</span>
                    <span className="font-mono text-xs font-semibold text-mp-slate">
                      {supplier.nafdac_licence}
                    </span>
                  </div>
                  {supplier.iso_certification && (
                    <p className="text-xs text-mp-green mt-0.5">
                      {supplier.iso_certification}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  {isApproved ? (
                    <>
                      <div className="flex items-center gap-1.5 text-mp-green text-sm font-semibold">
                        <CheckCircle size={16} />
                        Approved
                      </div>
                      {hasOnChain && (
                        <StellarBadge
                          explorerUrl={state.explorerUrl}
                          label="On-chain record ↗"
                        />
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        handleApprove(
                          supplier.id,
                          supplier.name,
                          supplier.nafdac_licence,
                        )
                      }
                      disabled={loading === supplier.id}
                      className="
                        btn-3d bg-mp-green text-white
                        px-4 py-2 rounded-xl text-sm font-bold
                        flex items-center gap-2
                        disabled:opacity-50
                      "
                    >
                      {loading === supplier.id ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10"
                              stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Writing to Stellar…
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={14} />
                          Approve supplier
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </Card3D>
          );
        })}
      </div>
    </div>
  );
}