'use client';

import { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';

import { fetchLiveBalance, fetchTransactions } from '@/lib/stellar';

import { ModuleHeader } from '@/components/shared/ModuleHeader';
import { Card3D } from '@/components/shared/Card3D';
import { BalanceCard } from '@/components/balance/BalanceCard';

export default function BalancePage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [xlmBalance, setXlmBalance] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // 💰 FETCH BALANCE
  // -----------------------------
  const refreshBalance = async (address: string) => {
    setLoading(true);
    try {
      const bal = await fetchLiveBalance(address);
      setXlmBalance(bal);
    } catch (err) {
      console.error('Balance fetch failed:', err);
      setXlmBalance("0.00000");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // 📜 FETCH TRANSACTIONS
  // -----------------------------
  const loadTransactions = async (address: string) => {
    try {
      const txs = await fetchTransactions(address);
      setTransactions(txs);
    } catch (err) {
      console.error('Transaction fetch failed:', err);
      setTransactions([]);
    }
  };

  // -----------------------------
  // 🔄 TRIGGER ON WALLET CONNECT
  // -----------------------------
  useEffect(() => {
    if (!walletAddress) return;

    refreshBalance(walletAddress);
    loadTransactions(walletAddress);
  }, [walletAddress]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      <ModuleHeader
        icon={<Wallet size={28} className="text-white drop-shadow-sm" />}
        title="Zytrak Balance"
        tagline="Your funds, available instantly — domestic and cross-border"
        gradient="bg-gradient-to-br from-blue-600 to-blue-900"
      />

      {/* 💳 WALLET CARD */}
      <BalanceCard 
        walletAddress={walletAddress}
        setWalletAddress={setWalletAddress}
        xlmBalance={xlmBalance}
        loading={loading}
        onRefresh={() => walletAddress && refreshBalance(walletAddress)}
      />

      {/* 📜 TRANSACTION HISTORY */}
      <Card3D className="bg-white">
        <h2 className="font-bold text-gray-900 text-sm mb-4">
          Transaction history
        </h2>

        <div className="divide-y divide-gray-50">
          {!walletAddress ? (
            <p className="text-sm text-gray-500 py-4 text-center">
              Connect wallet to view transactions
            </p>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">
              No transactions found
            </p>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="py-3">
                <p className="font-mono text-xs text-gray-700">
                  {tx.hash.slice(0, 12)}...
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(tx.createdAt).toLocaleString()}
                </p>
                <p className="text-xs">
                  {tx.successful ? "✅ Success" : "❌ Failed"} • Fee: {tx.fee}
                </p>
              </div>
            ))
          )}
        </div>
      </Card3D>

    </div>
  );
}