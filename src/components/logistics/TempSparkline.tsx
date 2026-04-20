interface TempSparklineProps {
  readings:  number[];
  minSafe?:  number;
  maxSafe?:  number;
  width?:    number;
  height?:   number;
}

export function TempSparkline({
  readings,
  minSafe  = 2,
  maxSafe  = 8,
  width    = 280,
  height   = 64,
}: TempSparklineProps) {
  if (!readings || readings.length < 2) {
    return (
      <div className="flex items-center justify-center h-16 text-xs text-gray-400">
        No temperature data
      </div>
    );
  }

  const PAD    = { top: 8, right: 8, bottom: 20, left: 32 };
  const chartW = width  - PAD.left - PAD.right;
  const chartH = height - PAD.top  - PAD.bottom;

  const allVals = [...readings, minSafe, maxSafe];
  const rawMin  = Math.min(...allVals);
  const rawMax  = Math.max(...allVals);
  const span    = rawMax - rawMin || 1;
  const yMin    = rawMin - span * 0.15;
  const yMax    = rawMax + span * 0.15;
  const ySpan   = yMax - yMin;

  const toX = (i: number) =>
    PAD.left + (i / (readings.length - 1)) * chartW;

  const toY = (v: number) =>
    PAD.top + chartH - ((v - yMin) / ySpan) * chartH;

  const safeTop    = toY(maxSafe);
  const safeBottom = toY(minSafe);

  const yLabels = [
    { val: Math.round(yMin),              y: toY(yMin) },
    { val: Math.round((yMin + yMax) / 2), y: toY((yMin + yMax) / 2) },
    { val: Math.round(yMax),              y: toY(yMax) },
  ];

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Temperature readings: ${readings.join(', ')} °C`}
      >
        {/* Safe-range band */}
        <rect
          x={PAD.left} y={safeTop}
          width={chartW} height={safeBottom - safeTop}
          fill="#DCFCE7" fillOpacity="0.6"
        />

        {/* Safe-range boundary lines */}
        <line
          x1={PAD.left} y1={safeTop}
          x2={PAD.left + chartW} y2={safeTop}
          stroke="#16A34A" strokeWidth="0.8" strokeDasharray="3 2"
        />
        <line
          x1={PAD.left} y1={safeBottom}
          x2={PAD.left + chartW} y2={safeBottom}
          stroke="#16A34A" strokeWidth="0.8" strokeDasharray="3 2"
        />

        {/* Y-axis labels */}
        {yLabels.map((l) => (
          <text
            key={l.val}
            x={PAD.left - 4} y={l.y + 3}
            textAnchor="end" fontSize="8" fill="#9CA3AF"
          >
            {l.val}°
          </text>
        ))}

        {/* Shadow line */}
        {readings.slice(0, -1).map((_, i) => (
          <line
            key={`shadow-${i}`}
            x1={(toX(i) + 1).toFixed(1)}   y1={(toY(readings[i]) + 1).toFixed(1)}
            x2={(toX(i+1) + 1).toFixed(1)} y2={(toY(readings[i+1]) + 1).toFixed(1)}
            stroke="rgba(0,0,0,0.10)" strokeWidth="2.5"
            strokeLinecap="round"
          />
        ))}

        {/* Main trend line — coloured per segment */}
        {readings.slice(0, -1).map((v, i) => {
          const inRange =
            v >= minSafe && v <= maxSafe &&
            readings[i + 1] >= minSafe && readings[i + 1] <= maxSafe;
          return (
            <line
              key={i}
              x1={toX(i).toFixed(1)}   y1={toY(v).toFixed(1)}
              x2={toX(i+1).toFixed(1)} y2={toY(readings[i+1]).toFixed(1)}
              stroke={inRange ? '#16A34A' : '#DC2626'}
              strokeWidth="2" strokeLinecap="round"
            />
          );
        })}

        {/* Dot markers */}
        {readings.map((v, i) => (
          <circle
            key={i}
            cx={toX(i).toFixed(1)} cy={toY(v).toFixed(1)}
            r="2.5"
            fill={v >= minSafe && v <= maxSafe ? '#16A34A' : '#DC2626'}
            stroke="white" strokeWidth="1"
          />
        ))}

        {/* X-axis labels */}
        <text
          x={PAD.left} y={height - 4}
          fontSize="8" fill="#9CA3AF" textAnchor="middle"
        >
          Dispatch
        </text>
        <text
          x={PAD.left + chartW} y={height - 4}
          fontSize="8" fill="#9CA3AF" textAnchor="middle"
        >
          Now
        </text>
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-1">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-green-600 rounded" />
          <span className="text-xs text-gray-500">
            In range ({minSafe}–{maxSafe}°C)
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-red-600 rounded" />
          <span className="text-xs text-gray-500">Out of range</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-2 rounded-sm bg-green-100 border border-green-300 border-dashed" />
          <span className="text-xs text-gray-500">Safe band</span>
        </div>
      </div>
    </div>
  );
}