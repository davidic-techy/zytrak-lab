'use client';

import { useState } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { ExternalLink, Link2, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

// ✅ NEW Freighter import style
import * as freighterApi from '@stellar/freighter-api';

import { 
  buildUnsignedNetworkPing, 
  submitSignedTransaction 
} from '@/lib/stellar';

const XLM_TO_NGN = 185;

export function BalanceCard({
  walletAddress,
  setWalletAddress,
  xlmBalance,
  loading,
  onRefresh
}: {
  walletAddress: string | null;
  setWalletAddress: (addr: string) => void;
  xlmBalance: string | null;
  loading: boolean;
  onRefresh: () => void;
}) {

  const [sending, setSending] = useState(false);

  const ngn = xlmBalance
    ? (parseFloat(xlmBalance) * XLM_TO_NGN).toLocaleString('en-NG')
    : '—';

  // -------------------------------
  // 🔗 CONNECT FREIGHTER WALLET
  // -------------------------------
  const handleConnectWallet = async () => {
    try {
      const connected = await freighterApi.isConnected();

      if (!connected) {
        return toast.error("Please install the Freighter extension!");
      }

      const { address } = await freighterApi.getAddress();

      if (!address) {
        throw new Error("No wallet address returned");
      }

      setWalletAddress(address);
      toast.success("Wallet connected!");
    } catch (error) {
      console.error(error);
      toast.error("Connection failed.");
    }
  };

  // -------------------------------
  // ✍️ SIGN + SUBMIT TRANSACTION
  // -------------------------------
  const handleTestFee = async () => {
    if (!walletAddress) return;

    setSending(true);
    const toastId = toast.loading("Sign the transaction in Freighter...");

    try {
      // 1. Build unsigned transaction (XDR)
      const unsignedXdr = await buildUnsignedNetworkPing(walletAddress);

      // 2. Ask Freighter to sign
      const { signedTxXdr } = await freighterApi.signTransaction(unsignedXdr, {
        networkPassphrase: "Test SDF Network ; September 2015",
      });

      if (!signedTxXdr) {
        throw new Error("Transaction signing failed");
      }

      // 3. Submit to Stellar
      toast.loading("Submitting to Stellar...", { id: toastId });

      await submitSignedTransaction(signedTxXdr);

      toast.success("Success! Transaction sent.", { id: toastId });

      // Refresh balance after tx
      onRefresh();

    } catch (error: any) {
      console.error(error);
      toast.error("Transaction failed.", { id: toastId });
    } finally {
      setSending(false);
    }
  };

  // -------------------------------
  // 🔌 NOT CONNECTED STATE
  // -------------------------------
  if (!walletAddress) {
    return (
      <div className="bg-linear-to-br from-blue-600 to-blue-900 rounded-2xl p-8 text-center text-white shadow-sm border border-blue-500 flex flex-col items-center justify-center min-h-55">
        
        <Wallet size={40} className="mb-4 text-blue-300 opacity-80" />

        <h2 className="text-xl font-bold mb-2">
          Connect your Wallet
        </h2>

        <p className="text-sm text-blue-200 mb-6 max-w-sm">
          Connect your Freighter wallet to view your live Stellar balance.
        </p>

        <button 
          onClick={handleConnectWallet}
          className="bg-white text-blue-700 hover:bg-blue-50 transition-colors px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2"
        >
          <Link2 size={16} />
          Connect Freighter
        </button>
      </div>
    );
  }

  // -------------------------------
  // 💰 CONNECTED STATE
  // -------------------------------
  return (
    <div className="bg-linear-to-br from-blue-600 to-blue-900 rounded-2xl p-6 text-white shadow-sm border border-blue-500">
      
      <div className="flex justify-between items-start mb-1">
        <p className="text-sm text-blue-100 font-medium">
          Available balance
        </p>

        <a
          href={`https://stellar.expert/explorer/testnet/account/${walletAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[10px] text-blue-100 bg-white/10 px-2.5 py-1 rounded-md font-mono"
        >
          {walletAddress.slice(0, 5)}...{walletAddress.slice(-4)}
          <ExternalLink size={12} />
        </a>
      </div>

      {loading ? (
        <Skeleton className="h-10 w-48 bg-white/20 mb-2 rounded-lg" />
      ) : (
        <p className="text-4xl font-black tracking-tight mb-1 drop-shadow-sm">
          {xlmBalance ?? '0.00000'}{' '}
          <span className="text-lg font-bold opacity-80">XLM</span>
        </p>
      )}

      <p className="text-sm text-blue-100 font-medium">
        ≈ ₦{ngn}
      </p>

      <div className="flex gap-3 mt-6">
        <button className="flex-1 bg-white text-blue-700 hover:bg-blue-50 transition-colors py-2.5 rounded-xl text-sm font-bold">
          ↓ Receive
        </button>
        
        <button 
          onClick={handleTestFee}
          disabled={sending || loading}
          className="flex-1 bg-white/20 text-white hover:bg-white/30 transition-colors py-2.5 rounded-xl text-sm font-bold border border-white/10 disabled:opacity-50"
        >
          {sending ? "Signing..." : "↑ Sign Test Tx"}
        </button>
      </div>
    </div>
  );
}