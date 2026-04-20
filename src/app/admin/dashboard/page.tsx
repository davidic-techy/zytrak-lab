"use client";
import { useState, useEffect } from "react";
import { MOCK_SUPPLIERS } from "@/lib/mock-data";
import { useSupplierStore } from "@/lib/store";
import { writeProvenanceRecord } from "@/lib/stellar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StellarBadge } from "@/components/shared/StellarBadge";
import { ShieldCheck, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const { approved, approveSupplier } = useSupplierStore();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleApprove = async (supplier: any) => {
    setLoadingId(supplier.id);
    const loadingToast = toast.loading("Writing approval to Stellar blockchain...");

    // This creates the immutable hash on the Stellar Testnet
    const record = await writeProvenanceRecord("supplier_approved", supplier.id, {
      supplier_name: supplier.name,
      nafdac_licence: supplier.nafdac_licence,
      iso_certification: supplier.iso_certification || "N/A",
      verified_by: "Zytrak SuperAdmin",
    });

    toast.dismiss(loadingToast);
    
    if (record) {
      approveSupplier(supplier.id, record.explorerUrl);
      toast.success("Supplier verified! Immutable record created.");
    } else {
      toast.error("Blockchain write failed. Check your network.");
    }
    setLoadingId(null);
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Supplier Verification</h1>
        <p className="text-sm text-gray-500 mt-1">Review and commit supplier credentials to the blockchain.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4">NAFDAC Status</th>
              <th className="px-6 py-4">ISO Certification</th>
              <th className="px-6 py-4 text-right">Verification Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK_SUPPLIERS.map(sup => {
              const isApproved = !!approved[sup.id]?.explorerUrl;
              const isPending = sup.nafdac_licence.includes("Pending");

              return (
                <tr key={sup.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{sup.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{sup.state} · {sup.type === "local" ? "Domestic" : "International"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {isPending ? <AlertCircle size={16} className="text-amber-500" /> : <ShieldCheck size={16} className="text-green-600" />}
                      <span className="font-mono text-xs">{sup.nafdac_licence}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-600">{sup.iso_certification || "—"}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isApproved ? (
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="success">✓ Verified On-Chain</Badge>
                        <StellarBadge explorerUrl={approved[sup.id].explorerUrl} label="View Proof ↗" />
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(sup)}
                        loading={loadingId === sup.id}
                        className="bg-slate-900 hover:bg-slate-800 text-white"
                      >
                        Approve to Ledger
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}