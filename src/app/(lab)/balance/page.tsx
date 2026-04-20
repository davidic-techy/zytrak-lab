'use client';

import { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import { fetchLiveBalance } from '@/lib/stellar';
import { ModuleHeader }  from '@/components/shared/ModuleHeader';
import { Card3D }        from '@/components/shared/Card3D';
import { BalanceCard }   from '@/components/balance/BalanceCard';
import { TransactionRow } from '@/components/balance/TransactionRow';
import { MOCK_BALANCE_TRANSACTIONS } from '@/lib/mock-data';

export default function BalancePage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [xlmBalance, setXlmBalance]       = useState<string | null>(null);
  const [loading, setLoading]             = useState(false);

  // Fetch balance whenever the wallet address changes
  const refreshBalance = async (address: string) => {
    setLoading(true);
    try {
      const bal = await fetchLiveBalance(address);
      setXlmBalance(bal);
    } catch (err) {
      setXlmBalance("0.00000");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) refreshBalance(walletAddress);
  }, [walletAddress]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <ModuleHeader
        icon={<Wallet size={28} className="text-white drop-shadow-sm" />}
        title="Zytrak Balance"
        tagline="Your funds, available instantly — domestic and cross-border"
        gradient="bg-gradient-to-br from-blue-600 to-blue-900"
      />

      <BalanceCard 
        walletAddress={walletAddress}
        setWalletAddress={setWalletAddress}
        xlmBalance={xlmBalance} 
        loading={loading} 
        onRefresh={() => walletAddress && refreshBalance(walletAddress)} 
      />

      <Card3D className="bg-white">
        <h2 className="font-bold text-gray-900 text-sm mb-4">Transaction history</h2>
        <div className="divide-y divide-gray-50">
          {MOCK_BALANCE_TRANSACTIONS.map((tx, i) => (
            <TransactionRow key={tx.id || i} tx={tx} />
          ))}
        </div>
      </Card3D>
    </div>
  );
}