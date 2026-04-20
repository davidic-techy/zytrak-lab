'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { isConnected, requestAccess, signTransaction } from '@stellar/freighter-api';
import { buildCheckoutTransaction, submitSignedTransaction } from '@/lib/stellar';
import { ShieldCheck } from 'lucide-react';

interface CheckoutProps {
  supplierPublicKey: string;
  orderTotalAmount: number;
  onSuccess?: () => void;
}

export function CheckoutButton({ supplierPublicKey, orderTotalAmount, onSuccess }: CheckoutProps) {
  const [processing, setProcessing] = useState(false);

  const handleCheckout = async () => {
    setProcessing(true);
    const t = toast.loading("Connecting to Freighter...");

    try {
      // 1. Check if wallet is connected
      const connectedStatus = await isConnected();
      const isWalletConnected = typeof connectedStatus === 'object' ? connectedStatus.isConnected : connectedStatus;
      
      if (!isWalletConnected) {
        throw new Error("Freighter wallet not detected. Please install the extension.");
      }

      // FIXED: Use requestAccess() instead of requestPublicKey()
      const accessObj = await requestAccess();
      if (accessObj.error || !accessObj.address) {
        throw new Error(accessObj.error || "Wallet connection denied.");
      }
      const buyerPubKey = accessObj.address;
      
      toast.loading("Please approve the split payment in Freighter...", { id: t });

      // 2. Build the atomic split transaction (98.5% to supplier, 1.5% to Zytrak)
      const unsignedXdr = await buildCheckoutTransaction(
        buyerPubKey, 
        supplierPublicKey, 
        orderTotalAmount
      );

      // 3. Lab signs the transaction with their institutional wallet
      const result = await signTransaction(unsignedXdr, {
        networkPassphrase: "Test SDF Network ; September 2015",
      });

      // FIXED: Safely check for errors and extract the signed string
      if (result.error) {
         throw new Error(result.error as string);
      }
      const xdrToSubmit = result.signedTxXdr;
      if (!xdrToSubmit) {
        throw new Error("Signing cancelled or failed.");
      }

      // 4. Submit to the Stellar network
      toast.loading("Processing payment on-chain...", { id: t });
      await submitSignedTransaction(xdrToSubmit);

      toast.success("Order paid! Platform fee routed automatically.", { id: t });
      if (onSuccess) onSuccess();

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Checkout failed.", { id: t });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <button 
      onClick={handleCheckout}
      disabled={processing}
      className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors py-3 px-4 rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
    >
      <ShieldCheck size={18} />
      {processing ? "Processing on-chain..." : `Pay ${orderTotalAmount} XLM Securely`}
    </button>
  );
}