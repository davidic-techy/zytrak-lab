interface Props {
  score:  number;
  label?: string;
  size?:  number;
}

export function SupplyHealthScore({ score, label = 'Supply Health', size = 120 }: Props) {
  const r             = size * 0.38;
  const cx            = size / 2;
  const cy            = size / 2;
  const circumference = 2 * Math.PI * r;
  const offset        = circumference * (1 - score / 100);
  const strokeW       = size * 0.07;
  const colour        = score >= 80 ? '#0E7490' : score >= 60 ? '#D97706' : '#DC2626';
  const bg            = score >= 80 ? '#ECFEFF'  : score >= 60 ? '#FEF3C7'  : '#FEF2F2';

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="drop-shadow-lg">
        <circle cx={cx} cy={cy} r={r} fill={bg} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" strokeWidth={strokeW} />
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={colour}
          strokeWidth={strokeW}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <text
          x={cx} y={cy + 2}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={size * 0.22} fontWeight="900" fill={colour}
        >
          {score}
        </text>
        <text x={cx} y={cy + size * 0.2} textAnchor="middle" fontSize={size * 0.1} fill="#6B7280">
          /100
        </text>
      </svg>
      <p className="text-xs font-semibold text-gray-600 mt-1 text-center">{label}</p>
    </div>
  );
}