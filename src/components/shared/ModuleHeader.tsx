"use client";
import { clsx } from "clsx";

interface Props {
  icon: React.ReactNode;
  title: string;
  tagline: string;
  gradient?: string; // We will pass full tailwind background classes here now
  stats?: { label: string; value: string | number }[];
}

export function ModuleHeader({ icon, title, tagline, gradient, stats }: Props) {
  // Fallback to a rich blue/indigo if no gradient is provided
  const bgClass = gradient || "bg-gradient-to-br from-blue-600 to-indigo-900";

  return (
    <div className={clsx("rounded-2xl p-6 mb-6 text-white shadow-lg", bgClass)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl drop-shadow-lg flex items-center justify-center">
              {icon}
            </span>
            <div>
              <h1 className="text-2xl font-black tracking-tight drop-shadow-md">{title}</h1>
              <p className="text-sm opacity-90 mt-0.5">{tagline}</p>
            </div>
          </div>
        </div>
        {stats && (
          <div className="flex gap-3">
            {stats.map(s => (
              <div key={s.label} className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-sm">
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-white/80 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}