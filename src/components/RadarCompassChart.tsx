import React from 'react';
import { VirtueKey } from '../types/workshop';
import { VIRTUES_DATA } from '../data/virtuesData';

interface RadarCompassChartProps {
  selfScores: Record<VirtueKey, number>;
  peerScores?: Record<VirtueKey, number>;
  size?: number;
  showLegend?: boolean;
  participantName?: string;
}

export const RadarCompassChart: React.FC<RadarCompassChartProps> = ({
  selfScores,
  peerScores,
  size = 360,
  showLegend = true,
  participantName = 'Participant',
}) => {
  const center = size / 2;
  const radius = size * 0.38;

  // 4 virtues mapped to 4 cardinal directions:
  // North (Prudence), East (Justice), South (Temperance), West (Fortitude)
  const axes: { key: VirtueKey; label: string; angle: number; align: 'top' | 'right' | 'bottom' | 'left' }[] = [
    { key: 'prudence', label: 'Prudence (Nord)', angle: -Math.PI / 2, align: 'top' },
    { key: 'justice', label: 'Justice (Est)', angle: 0, align: 'right' },
    { key: 'temperance', label: 'Tempérance (Sud)', angle: Math.PI / 2, align: 'bottom' },
    { key: 'fortitude', label: "Force d'Âme (Ouest)", angle: Math.PI, align: 'left' },
  ];

  // Helper to get coordinates on radar (score from 0 to 20)
  const getCoordinates = (score: number, angle: number) => {
    const clamped = Math.max(0, Math.min(20, score));
    const dist = (clamped / 20) * radius;
    return {
      x: center + dist * Math.cos(angle),
      y: center + dist * Math.sin(angle),
    };
  };

  // Build SVG polygon points string
  const getPolygonPoints = (scores: Record<VirtueKey, number>) => {
    return axes
      .map((axis) => {
        const { x, y } = getCoordinates(scores[axis.key] || 0, axis.angle);
        return `${x},${y}`;
      })
      .join(' ');
  };

  const selfPoints = getPolygonPoints(selfScores);
  const peerPoints = peerScores ? getPolygonPoints(peerScores) : null;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="overflow-visible select-none drop-shadow-xs"
          aria-label={`Boussole des vertus pour ${participantName}`}
        >
          {/* Subtle outer compass circle */}
          <circle
            cx={center}
            cy={center}
            r={radius + 16}
            fill="#FAF8F5"
            stroke="#E7E2DA"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Concentric grid circles (5, 10, 15, 20) */}
          {[5, 10, 15, 20].map((level) => {
            const r = (level / 20) * radius;
            return (
              <g key={level}>
                <circle
                  cx={center}
                  cy={center}
                  r={r}
                  fill="none"
                  stroke={level === 20 ? '#D6CEBE' : '#EAE5DC'}
                  strokeWidth={level === 20 ? '1.5' : '1'}
                />
                <text
                  x={center + 4}
                  y={center - r + 11}
                  fill="#A8A29E"
                  fontSize="9"
                  className="font-mono tabular-nums"
                >
                  {level}
                </text>
              </g>
            );
          })}

          {/* Cardinal axes lines */}
          {axes.map((axis) => {
            const end = getCoordinates(20, axis.angle);
            return (
              <line
                key={axis.key}
                x1={center}
                y1={center}
                x2={end.x}
                y2={end.y}
                stroke="#D6CEBE"
                strokeWidth="1.2"
              />
            );
          })}

          {/* Peer polygon (if available) - soft blue/indigo wash */}
          {peerPoints && (
            <polygon
              points={peerPoints}
              fill="rgba(79, 70, 229, 0.16)"
              stroke="#4F46E5"
              strokeWidth="2"
              strokeDasharray="4 3"
              className="transition-all duration-300"
            />
          )}

          {/* Self polygon - warm amber/terracotta wash */}
          <polygon
            points={selfPoints}
            fill="rgba(180, 83, 9, 0.22)"
            stroke="#B45309"
            strokeWidth="2.5"
            className="transition-all duration-300"
          />

          {/* Data points for Self */}
          {axes.map((axis) => {
            const { x, y } = getCoordinates(selfScores[axis.key] || 0, axis.angle);
            return (
              <g key={`self-${axis.key}`}>
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#B45309"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              </g>
            );
          })}

          {/* Data points for Peer */}
          {peerScores &&
            axes.map((axis) => {
              const { x, y } = getCoordinates(peerScores[axis.key] || 0, axis.angle);
              return (
                <g key={`peer-${axis.key}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4.5"
                    fill="#4F46E5"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}

          {/* Compass center pivot pin */}
          <circle cx={center} cy={center} r="3.5" fill="#78350F" />
          <circle cx={center} cy={center} r="1.5" fill="#FFFFFF" />

          {/* Outer Labels */}
          {axes.map((axis) => {
            const virtue = VIRTUES_DATA[axis.key];
            const labelDist = radius + 28;
            const lx = center + labelDist * Math.cos(axis.angle);
            const ly = center + labelDist * Math.sin(axis.angle);

            let textAnchor: 'middle' | 'start' | 'end' = 'middle';
            let dy = '0.35em';

            if (axis.align === 'top') {
              dy = '-0.6em';
            } else if (axis.align === 'bottom') {
              dy = '1.3em';
            } else if (axis.align === 'left') {
              textAnchor = 'end';
            } else if (axis.align === 'right') {
              textAnchor = 'start';
            }

            return (
              <g key={`label-${axis.key}`} transform={`translate(${lx}, ${ly})`}>
                <text
                  x="0"
                  y="0"
                  dy={dy}
                  textAnchor={textAnchor}
                  className="font-serif font-semibold text-xs fill-stone-800"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '13px' }}
                >
                  {virtue.frenchTitle}
                </text>
                <text
                  x="0"
                  y={axis.align === 'bottom' ? '28' : axis.align === 'top' ? '-7' : '14'}
                  textAnchor={textAnchor}
                  className="font-mono text-[10px] tabular-nums fill-stone-500"
                >
                  Moi: {selfScores[axis.key]}/20
                  {peerScores && ` · Amis: ${peerScores[axis.key]}/20`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend below chart */}
      {showLegend && (
        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-stone-200 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#B45309] inline-block" />
            <span className="font-medium text-stone-800">Auto-évaluation (Moi)</span>
          </div>
          {peerScores && (
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#4F46E5] inline-block" />
              <span className="font-medium text-stone-800">Regard des amis (Moyenne 360°)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
