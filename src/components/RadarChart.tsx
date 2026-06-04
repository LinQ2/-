import { motion } from 'motion/react';
import { InterestPreference } from '../types';

interface RadarChartProps {
  interests?: InterestPreference[];
}

export default function RadarChart({ interests }: RadarChartProps) {
  // Safe default interests fallback
  const items = interests && interests.length >= 5 ? interests.slice(0, 5) : [
    { name: "日常穿搭", value: 85 },
    { name: "美妆护肤", value: 78 },
    { name: "生活好物", value: 68 },
    { name: "美食探店", value: 55 },
    { name: "数码配件", value: 45 }
  ];

  // SVG Geometry parameters
  const width = 280;
  const height = 230;
  const cx = width / 2;
  const cy = height / 2 - 5;
  const rMax = 70;
  const numPoints = 5;

  // Calculate coordinates for vertices
  const getCoordinates = (index: number, radius: number) => {
    const angle = (2 * Math.PI * index) / numPoints - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      angle
    };
  };

  // 1. Generate concentric background pentagons (scales)
  const scales = [0.2, 0.4, 0.6, 0.8, 1.0];
  const gridPolygons = scales.map((scale) => {
    const points = Array.from({ length: numPoints }, (_, idx) => {
      const { x, y } = getCoordinates(idx, rMax * scale);
      return `${x},${y}`;
    }).join(' ');
    return { points, scale };
  });

  // 2. Generate radial grid spoke lines
  const spokes = Array.from({ length: numPoints }, (_, idx) => {
    const outer = getCoordinates(idx, rMax);
    return { x1: cx, y1: cy, x2: outer.x, y2: outer.y };
  });

  // 3. Generate data polygon
  const dataPoints = items.map((item, idx) => {
    const { x, y } = getCoordinates(idx, rMax * (item.value / 100));
    return { x, y, name: item.name, value: item.value };
  });

  const dataPolygonPointsString = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // 4. Generate label placement with smart offsets to avoid overlaps
  const labels = items.map((item, idx) => {
    const outer = getCoordinates(idx, rMax);
    const cosVal = Math.cos(outer.angle);
    const sinVal = Math.sin(outer.angle);

    // Apply anchors based on angle to avoid truncation
    let textAnchor = "middle";
    let xOffset = 0;
    let yOffset = 0;

    if (cosVal > 0.15) {
      textAnchor = "start";
      xOffset = 6;
    } else if (cosVal < -0.15) {
      textAnchor = "end";
      xOffset = -6;
    }

    if (sinVal < -0.75) {
      yOffset = -10;
    } else if (sinVal > 0.75) {
      yOffset = 14;
    } else {
      yOffset = 4;
    }

    return {
      text: item.name,
      value: item.value,
      x: outer.x + xOffset,
      y: outer.y + yOffset,
      textAnchor
    };
  });

  return (
    <div className="flex flex-col items-center bg-slate-50/50 rounded-2xl p-3 border border-slate-200/40 mt-3.5 shadow-2xs">
      <div className="w-full flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
        <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 block"></span>
          兴趣偏好 (行业分布雷达)
        </span>
        <span className="text-[9px] text-slate-400 font-mono">TGI 浓度指数</span>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full flex justify-center overflow-visible">
        <svg 
          width={width} 
          height={height} 
          className="overflow-visible font-mono select-none"
        >
          <defs>
            {/* Visual glow gradients for the polygon fill */}
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
            </linearGradient>
            
            <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Concentric helper background loops */}
          {gridPolygons.map((gp, index) => (
            <polygon
              key={`grid-${index}`}
              points={gp.points}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={gp.scale === 1.0 ? "1.2" : "0.7"}
              strokeDasharray={gp.scale !== 1.0 ? "3,3" : undefined}
            />
          ))}

          {/* Grid concentric background labels */}
          {scales.slice(1, 5).map((scale, idx) => {
            const labelCoord = getCoordinates(0, rMax * scale);
            return (
              <text 
                key={`scale-lbl-${idx}`} 
                x={labelCoord.x + 3} 
                y={labelCoord.y + 11} 
                fill="#94a3b8" 
                fontSize="8" 
                textAnchor="start"
              >
                {Math.round(scale * 100)}
              </text>
            );
          })}

          {/* Spoke separators */}
          {spokes.map((sp, index) => (
            <line
              key={`spoke-${index}`}
              x1={sp.x1}
              y1={sp.y1}
              x2={sp.x2}
              y2={sp.y2}
              stroke="#e2e8f0"
              strokeWidth="0.8"
            />
          ))}

          {/* Filled active radar polygon */}
          <motion.polygon
            initial={{ scale: 0.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 14 }}
            points={dataPolygonPointsString}
            fill="url(#radarGradient)"
            stroke="#4f46e5"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Circular vertex indicators */}
          {dataPoints.map((pt, index) => (
            <g key={`marker-${index}`}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="#ffffff"
                stroke="#06b6d4"
                strokeWidth="2.2"
                className="pointer-events-none drop-shadow-sm"
              />
              <circle
                cx={pt.x}
                cy={pt.y}
                r="2"
                fill="#4f46e5"
                className="pointer-events-none"
              />
            </g>
          ))}

          {/* Smart directional label text objects */}
          {labels.map((lbl, index) => (
            <g key={`lbl-${index}`}>
              <text
                x={lbl.x}
                y={lbl.y}
                fill="#1e293b"
                fontSize="10"
                fontWeight="bold"
                textAnchor={lbl.textAnchor}
              >
                {lbl.text}
              </text>
              <text
                x={lbl.x}
                y={lbl.y + 10}
                fill="#64748b"
                fontSize="8"
                fontWeight="normal"
                textAnchor={lbl.textAnchor}
              >
                {lbl.value}%
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Accompanying exact list rows below so they fit easily and represent readable stats */}
      <div className="w-full mt-2 space-y-1.5 pt-2 border-t border-slate-100 px-1">
        {items.map((it, idx) => (
          <div key={idx} className="flex items-center gap-2 text-[10px]">
            <span className="w-14 truncate font-bold text-slate-700">{it.name}</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${it.value}%` }} 
                transition={{ duration: 0.8, delay: idx * 0.08 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
              ></motion.div>
            </div>
            <span className="w-8 text-right font-mono font-bold text-indigo-900">{it.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
