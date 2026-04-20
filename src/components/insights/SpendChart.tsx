import type { MonthlySpend } from '@/lib/mock-data';

interface Props {
  data:   MonthlySpend[];
  color?: string;
}

export function SpendChart({ data, color = '#0E7490' }: Props) {
  const W      = 560;
  const H      = 180;
  const PAD    = { top: 16, right: 16, bottom: 36, left: 60 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top  - PAD.bottom;
  const max    = Math.max(...data.map(d => d.amount));
  const gap    = chartW / data.length;
  const barW   = gap * 0.6;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      {[0, 0.25, 0.5, 0.75, 1].map(pct => {
        const y = PAD.top + chartH * (1 - pct);
        return (
          <g key={pct}>
            <line
              x1={PAD.left - 4} y1={y}
              x2={W - PAD.right} y2={y}
              stroke="#E5E7EB" strokeWidth="1"
            />
            <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#9CA3AF">
              ₦{((max * pct) / 1000).toFixed(0)}k
            </text>
          </g>
        );
      })}

      {data.map((d, i) => {
        const barH = (d.amount / max) * chartH;
        const x    = PAD.left + gap * i + (gap - barW) / 2;
        const y    = PAD.top  + chartH - barH;
        return (
          <g key={d.month}>
            <rect x={x + 2} y={y + 2} width={barW} height={barH} rx="4" fill="rgba(0,0,0,0.08)" />
            <rect x={x} y={y} width={barW} height={barH} rx="4" fill={color} fillOpacity="0.85" />
            <rect x={x} y={y} width={barW} height="4" rx="4" fill={color} />
            <text x={x + barW / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="#6B7280">
              {d.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
}