"use client";
interface Props { ngnAmount: number; onConfirm: ()=>void; loading: boolean; }

const RATE    = 1590;   // NGN per USDC (Yellow Card rate)
const FEE_PCT = 0.0075; // 0.75% Yellow Card conversion fee

export function USDCConversionPreview({ ngnAmount, onConfirm, loading }: Props) {
  const usdc_gross   = ngnAmount / RATE;
  const fee_usdc     = usdc_gross * FEE_PCT;
  const usdc_net     = usdc_gross - fee_usdc;
  const stellar_fee  = 0.0000001; // negligible

  return (
    <div className="bg-gradient-pay rounded-card p-5 space-y-3">
      <h3 className="font-bold text-pay">Payment preview</h3>

      {/* Conversion flow */}
      <div className="space-y-2">
        {[
          { label:"You pay (NGN)",           value:`₦${ngnAmount.toLocaleString()}`,   sub:"From your lab account" },
          { label:"Yellow Card converts",    value:`${usdc_gross.toFixed(4)} USDC`,    sub:"@₦1,590 per USDC" },
          { label:"Yellow Card fee (0.75%)", value:`-${fee_usdc.toFixed(4)} USDC`,     sub:"Licensed stablecoin ramp", neg:true },
          { label:"Stellar network fee",     value:`-$0.0001`,                          sub:"~₦0.16 — negligible", neg:true },
          { label:"Supplier receives",       value:`${usdc_net.toFixed(4)} USDC`,      sub:"Released on delivery confirmation", bold:true },
        ].map(row => (
          <div key={row.label} className={`flex justify-between items-start py-2 border-b border-pay/20 last:border-0 ${row.bold?"font-bold":""}`}>
            <div><p className="text-sm text-gray-700">{row.label}</p><p className="text-xs text-gray-400">{row.sub}</p></div>
            <p className={`text-sm font-semibold ${row.neg?"text-red-500":"text-pay"}`}>{row.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/60 rounded-lg p-3 text-xs text-gray-600">
        Payment held in Soroban escrow on Stellar until delivery confirmed.
        Released automatically — no manual intervention required.
      </div>

      <button onClick={onConfirm} disabled={loading}
        className="btn-3d w-full bg-pay text-white py-3 rounded-lg font-bold text-sm disabled:opacity-50">
        {loading ? "Initiating on Stellar..." : `Send ${usdc_net.toFixed(2)} USDC via Stellar`}
      </button>
    </div>
  );
}
