import React from 'react';
import {AbsoluteFill} from 'remotion';
import {House, Moon, Stars} from '../art/primitives';
import {COLORS, MONO, VIDEO} from '../theme';

/** Full-frame stage: SVG art below, HTML overlays and audio above. */
export const Stage: React.FC<{
  children?: React.ReactNode;
  overlay?: React.ReactNode;
  audio?: React.ReactNode;
  background?: string;
}> = ({children, overlay, audio, background = COLORS.navy}) => (
  <AbsoluteFill style={{background}}>
    <svg
      viewBox={`0 0 ${VIDEO.width} ${VIDEO.height}`}
      width="100%"
      height="100%"
      style={{position: 'absolute', top: 0, left: 0}}
    >
      {children}
    </svg>
    {overlay}
    {audio}
  </AbsoluteFill>
);

/** The recurring flat, orthographic night exterior on Hollow Road. */
export const NightExterior: React.FC<{
  children?: React.ReactNode;
  glow?: number;
  seed?: number;
}> = ({children, glow = 1, seed = 5}) => (
  <g>
    <rect x={0} y={0} width={VIDEO.width} height={VIDEO.height} fill={COLORS.navy} />
    <Stars seed={seed} count={90} height={1250} />
    <Moon x={880} y={300} r={72} />
    <rect x={0} y={1400} width={VIDEO.width} height={520} fill={COLORS.ground} />
    <rect x={0} y={1394} width={VIDEO.width} height={8} fill={COLORS.navyLight} />
    <House x={620} y={1400} width={520} height={480} glow={glow} />
    <circle cx={620} cy={1290} r={280} fill={COLORS.yellow} opacity={0.05} />
    <circle cx={620} cy={1270} r={140} fill={COLORS.yellow} opacity={0.06} />
    {children}
  </g>
);

export const RuleBadge: React.FC<{
  index: number;
  x: number;
  y: number;
  scale?: number;
}> = ({index, x, y, scale = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect
      x={-250}
      y={-90}
      width={500}
      height={180}
      rx={16}
      fill={COLORS.red}
      stroke={COLORS.white}
      strokeWidth={8}
    />
    <text
      x={0}
      y={18}
      textAnchor="middle"
      fontFamily={MONO}
      fontSize={84}
      fontWeight={800}
      letterSpacing={6}
      fill={COLORS.white}
    >
      {`RULE #${index}`}
    </text>
  </g>
);
