import { ORDER_STATUS_LABELS } from "@/lib/constants";
const STEPS = ["pending_payment","paid","confirmed","packed","dispatched","in_transit","delivered","confirmed_good"];

export function OrderStatusTimeline({ currentStatus }: { currentStatus: string }) {
  const idx = STEPS.indexOf(currentStatus);
  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-2">
      {STEPS.map((step, i) => {
        const done   = i < idx;
        const active = i === idx;
        return (
          <div key={step} className="flex items-start">
            <div className="flex flex-col items-center min-w-20">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                done   ? "bg-brand-teal text-white" :
                active ? "bg-brand-navy text-white ring-2 ring-brand-navy ring-offset-2" :
                         "bg-gray-100 text-gray-400"
              }`}>
                {done ? "✓" : i + 1}
              </div>
              <span className={`text-xs mt-1 text-center leading-tight px-1 ${
                active ? "text-brand-navy font-semibold" : "text-gray-400"
              }`}>{ORDER_STATUS_LABELS[step] ?? step}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-6 mt-4 shrink-0 ${i < idx ? "bg-brand-teal" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
