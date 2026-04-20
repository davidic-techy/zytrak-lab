"use client";
import { useState } from "react";
import { writeProvenanceRecord } from "@/lib/stellar";
import { Button } from "@/components/ui/Button";
import { StellarBadge } from "@/components/shared/StellarBadge";

export default function TestStellar() {
  const [result, setResult] = useState<{explorerUrl:string}|null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    const r = await writeProvenanceRecord("test_event", "test-001", { message: "Zytrak test" });
    setResult(r);
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-xl font-bold">Stellar connection test</h1>
      <Button loading={loading} onClick={run}>Write test record to Stellar Testnet</Button>
      {result && (
        <div className="space-y-2">
          <p className="text-green-700 font-semibold">✓ Transaction submitted!</p>
          <StellarBadge explorerUrl={result.explorerUrl} label="View transaction on Stellar Explorer" />
        </div>
      )}
    </div>
  );
}