import { TEMP_LABELS } from "@/lib/constants";
export function TemperatureBadge({ profile }: { profile: string }) {
  const t = TEMP_LABELS[profile] ?? TEMP_LABELS.ambient;
  return (
    <div className={`inline-flex flex-col rounded-lg px-3 py-1.5 text-xs ${t.color}`}>
      <span className="font-semibold">{t.label}</span>
      <span className="opacity-70">{t.storage}</span>
    </div>
  );
}
