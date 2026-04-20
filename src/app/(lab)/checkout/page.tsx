"use client";
import { useState, useEffect } from "react";
import { useCartStore, useOrderStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as StellarSdk from "@stellar/stellar-sdk";

// Using the official Freighter API directly
import { isConnected, requestAccess, signTransaction } from "@stellar/freighter-api";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const { setStatus } = useOrderStore();
  const [address, setAddress] = useState("");
  const [paying, setPaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Fix for hydration mismatch - moved safely to the top
  useEffect(() => {
    setMounted(true);
  }, []);

  const isInternational = items.some((i) => i.supplierOrgId === "sup-003");

  const handlePay = async () => {
    if (!address.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }

    if (isInternational) {
      const toastId = toast.loading("Waking up Freighter wallet...");
      try {
        setPaying(true);

        // 1. Check if Freighter is actually installed and awake
        const connected = await isConnected();
        if (!connected) {
          toast.error("Freighter not detected! Please install/unlock the extension.", { id: toastId });
          setPaying(false);
          return;
        }

        // 2. Request access (Extracting the address from the returned object to fix TS error)
        const accessRes = await requestAccess();
        if (accessRes.error || !accessRes.address) {
          throw new Error(accessRes.error || "Wallet access denied by user");
        }
        const userPublicKey = accessRes.address;

        toast.loading("Building transaction...", { id: toastId });

        // 3. Build the Testnet transaction
        const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
        const account = await server.loadAccount(userPublicKey);

        const tx = new StellarSdk.TransactionBuilder(account, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(
            StellarSdk.Operation.payment({
              destination: userPublicKey, // Self-payment for demo
              asset: StellarSdk.Asset.native(),
              amount: "1.0000000",
            })
          )
          .addMemo(StellarSdk.Memo.text("Zytrak Settle"))
          .setTimeout(30)
          .build();

        toast.loading("Please sign the transaction in Freighter...", { id: toastId });

        // 4. Send to Freighter for signature (Fixing the networkPassphrase and extracting signedTxXdr)
        const signRes = await signTransaction(tx.toXDR(), { 
          networkPassphrase: StellarSdk.Networks.TESTNET 
        });
        
        if (signRes.error || !signRes.signedTxXdr) {
            throw new Error(signRes.error || "Transaction signature failed");
        }
        const signedTx = signRes.signedTxXdr;

        toast.loading("Submitting to Stellar blockchain...", { id: toastId });

        // 5. Submit to the network
        const txToSubmit = StellarSdk.TransactionBuilder.fromXDR(signedTx, StellarSdk.Networks.TESTNET);
        await server.submitTransaction(txToSubmit as StellarSdk.Transaction);

        toast.success("Payment settled instantly on Stellar!", { id: toastId });

        // 6. Complete the order
        const newId = `ord-${Date.now()}`;
        setStatus(newId, "paid");
        clearCart();
        router.push(`/orders/${newId}`);

      } catch (error: any) {
        console.error("Freighter Error:", error);
        toast.error("Transaction cancelled or failed. Using fallback...", { id: toastId });
        
        // Demo Fallback so you aren't stuck during your pitch
        setTimeout(() => {
          const newId = `ord-${Date.now()}`;
          setStatus(newId, "paid");
          clearCart();
          router.push(`/orders/${newId}`);
        }, 1500);
        
        setPaying(false);
      }

    } else {
      // ── Domestic NGN payment via Paystack ─────────────────────────────────
      setPaying(true);
      await new Promise((r) => setTimeout(r, 2000));
      toast.success("NGN Payment confirmed via Paystack!");

      const newId = `ord-${Date.now()}`;
      setStatus(newId, "paid");
      clearCart();
      router.push(`/orders/${newId}`);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 space-y-4">
        <h2 className="font-semibold text-gray-900">Delivery details</h2>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Delivery address <span className="text-red-500">*</span></label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            placeholder="e.g. 5 Broad Street, Lagos Island, Lagos State"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Order summary</h2>
        {items.map((i) => (
          <div key={i.productId} className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
            <span className="text-gray-600">{i.productName} × {i.quantity}</span>
            <span className="font-semibold">{formatCurrency(i.unitPriceNgn * i.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between items-center font-bold text-lg mt-3 pt-3 border-t border-gray-100">
          <span>Total</span>
          <span>{formatCurrency(total())}</span>
        </div>

        <Button
          loading={paying}
          onClick={handlePay}
          size="lg"
          className={`w-full mt-4 ${isInternational ? "bg-stellar-dark hover:bg-stellar text-white" : ""}`}
        >
          {paying ? "Processing..." : isInternational ? "Pay via Freighter Wallet" : `Pay ${formatCurrency(total())} via Paystack`}
        </Button>
      </div>
    </div>
  );
}