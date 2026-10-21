import React from 'react';
import {COLORS, VIDEO} from '../theme';

/** Deterministic 0..1 noise so geometry never flickers between frames. */
export const makeRand = (seed: number) => {
  let s = (seed * 2654435761) >>> 0;
  if (s === 0) {
    s = 1;
  }
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

export const Stars: React.FC<{
  seed?: number;
  count?: number;
  width?: number;
  height?: number;
  opacity?: number;
}> = ({seed = 1, count = 90, width = VIDEO.width, height = 1250, opacity = 1}) => {
  const rand = makeRand(seed);
  const stars: {x: number; y: number; r: number; o: number}[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * width,
      y: rand() * height,
      r: 2 + rand() * 4,
      o: 0.35 + rand() * 0.6,
    });
  }
  return (
    <g opacity={opacity}>
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={COLORS.white} opacity={s.o} />
      ))}
    </g>
  );
};

export const Moon: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => (
  <g>
    <circle cx={x} cy={y} r={r * 2.1} fill={COLORS.white} opacity={0.06} />
    <circle cx={x} cy={y} r={r} fill={COLORS.offWhite} />
  </g>
);

/** Fake soft light with stacked solid circles — no gradients. */
export const Glow: React.FC<{
  x: number;
  y: number;
  r: number;
  color?: string;
  opacity?: number;
  rings?: number;
}> = ({x, y, r, color = COLORS.blueSoft, opacity = 0.16, rings = 5}) => (
  <g>
    {Array.from({length: rings}, (_, i) => (
      <circle
        key={i}
        cx={x}
        cy={y}
        r={(r * (i + 1)) / rings}
        fill={color}
        opacity={opacity / (i + 1)}
      />
    ))}
  </g>
);

export type Pose = 'stand' | 'walk' | 'wave' | 'reach' | 'armsUp' | 'sit';

export const StickFigure: React.FC<{
  x: number;
  y: number;
  height?: number;
  stroke?: string;
  strokeWidth?: number;
  pose?: Pose;
  phase?: number;
  headFill?: string;
  eyeColor?: string;
  eyeR?: number;
}> = ({
  x,
  y,
  height = 400,
  stroke = COLORS.white,
  strokeWidth = 11,
  pose = 'stand',
  phase = 0,
  headFill,
  eyeColor,
  eyeR = 3.4,
}) => {
  const s = height / 230;
  const head = {x: 0, y: -200};
  const shoulder = {x: 0, y: -150};
  const hip = {x: 0, y: -80};
  const armLen = 72;
  const legLen = 78;

  const swing = Math.sin(phase * Math.PI * 2);
  let armA = -14;
  let armB = 14;
  let legA = -12;
  let legB = 12;

  if (pose === 'walk') {
    armA = -34 * swing;
    armB = 34 * swing;
    legA = -26 * swing;
    legB = 26 * swing;
  } else if (pose === 'wave') {
    armB = 155;
    armA = -18;
  } else if (pose === 'reach') {
    armB = 88;
    armA = -14;
  } else if (pose === 'armsUp') {
    armA = -150;
    armB = 150;
  } else if (pose === 'sit') {
    armA = -22;
    armB = 22;
  }

  const limb = (
    from: {x: number; y: number},
    len: number,
    angle: number,
  ): {x: number; y: number} => {
    const r = (angle * Math.PI) / 180;
    return {x: from.x + Math.sin(r) * len, y: from.y + Math.cos(r) * len};
  };

  const handL = limb(shoulder, armLen, armA);
  const handR = limb(shoulder, armLen, armB);

  const sitting = pose === 'sit';
  const footL = sitting ? {x: 62, y: -6} : limb(hip, legLen, legA);
  const footR = sitting ? {x: 62, y: -6} : limb(hip, legLen, legB);
  const kneeL = sitting ? {x: 62, y: -74} : null;
  const kneeR = sitting ? {x: 62, y: -74} : null;

  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    >
      <circle
        cx={head.x}
        cy={head.y}
        r={30}
        fill={headFill ?? 'none'}
        stroke={stroke}
      />
      {eyeColor ? (
        <>
          <circle cx={head.x - 9} cy={head.y - 4} r={eyeR} fill={eyeColor} stroke="none" />
          <circle cx={head.x + 9} cy={head.y - 4} r={eyeR} fill={eyeColor} stroke="none" />
        </>
      ) : null}
      <line x1={head.x} y1={head.y + 30} x2={hip.x} y2={hip.y} />
      <line x1={shoulder.x} y1={shoulder.y} x2={handL.x} y2={handL.y} />
      <line x1={shoulder.x} y1={shoulder.y} x2={handR.x} y2={handR.y} />
      {sitting && kneeL && kneeR ? (
        <>
          <polyline points={`0,-80 ${kneeL.x},${kneeL.y} ${footL.x},${footL.y}`} />
          <polyline points={`0,-92 ${kneeR.x},${kneeR.y} ${footR.x},${footR.y}`} />
        </>
      ) : (
        <>
          <line x1={hip.x} y1={hip.y} x2={footL.x} y2={footL.y} />
          <line x1={hip.x} y1={hip.y} x2={footR.x} y2={footR.y} />
        </>
      )}
    </g>
  );
};

export const House: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  glow?: number;
}> = ({x, y, width, height, glow = 1}) => {
  const left = x - width / 2;
  const top = y - height;
  const roofH = 62;
  const doorW = width * 0.2;
  const windowOpacity = 0.72 + 0.28 * glow;

  return (
    <g>
      <rect
        x={left}
        y={top - roofH}
        width={width + 30}
        height={roofH}
        fill="#071026"
        stroke={COLORS.white}
        strokeWidth={8}
      />
      <rect
        x={left}
        y={top}
        width={width}
        height={height}
        fill="#0E1A38"
        stroke={COLORS.white}
        strokeWidth={8}
      />
      {[0, 1, 2, 3].map((i) => {
        const wx = left + (i % 2 === 0 ? width * 0.14 : width * 0.66);
        const wy = top + height * 0.12 + Math.floor(i / 2) * height * 0.4;
        return (
          <rect
            key={i}
            x={wx}
            y={wy}
            width={width * 0.18}
            height={height * 0.17}
            fill={COLORS.yellow}
            opacity={windowOpacity}
          />
        );
      })}
      <rect
        x={x - doorW / 2}
        y={y - height * 0.27}
        width={doorW}
        height={height * 0.27}
        fill={COLORS.ground}
        stroke={COLORS.white}
        strokeWidth={7}
      />
      <circle cx={x + doorW * 0.3} cy={y - height * 0.14} r={6} fill={COLORS.yellow} />
    </g>
  );
};

export const Car: React.FC<{
  x: number;
  y: number;
  width?: number;
  body?: string;
  headlights?: 'off' | 'right';
  tailLights?: boolean;
  opacity?: number;
}> = ({x, y, width = 250, body = COLORS.blue, headlights = 'right', tailLights = false, opacity = 1}) => {
  const h = width * 0.34;
  const left = -width / 2;
  const top = -h;
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      {headlights === 'right' ? (
        <polygon
          points={`${width / 2 - 6},${top + h * 0.2} ${width / 2 + 470},${top - h * 1.6} ${width / 2 + 470},${2}`}
          fill={COLORS.yellow}
          opacity={0.16}
        />
      ) : null}
      <rect
        x={left + width * 0.22}
        y={top - h * 0.5}
        width={width * 0.5}
        height={h * 0.6}
        rx={5}
        fill={body}
        stroke={COLORS.white}
        strokeWidth={7}
      />
      <rect
        x={left}
        y={top}
        width={width}
        height={h}
        rx={6}
        fill={body}
        stroke={COLORS.white}
        strokeWidth={7}
      />
      <circle
        cx={left + width * 0.24}
        cy={0}
        r={width * 0.11}
        fill={COLORS.ground}
        stroke={COLORS.white}
        strokeWidth={6}
      />
      <circle
        cx={left + width * 0.78}
        cy={0}
        r={width * 0.11}
        fill={COLORS.ground}
        stroke={COLORS.white}
        strokeWidth={6}
      />
      {headlights === 'right' ? (
        <rect
          x={width / 2 - 14}
          y={top + h * 0.3}
          width={14}
          height={h * 0.32}
          fill={COLORS.yellow}
        />
      ) : null}
      {tailLights ? (
        <g>
          <rect x={left} y={top + h * 0.3} width={14} height={h * 0.32} fill={COLORS.redBright} />
          <circle cx={left + 8} cy={top + h * 0.46} r={46} fill={COLORS.redBright} opacity={0.16} />
        </g>
      ) : null}
    </g>
  );
};

export const Couch: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect
      x={-260}
      y={-300}
      width={520}
      height={190}
      rx={22}
      fill={COLORS.purple}
      stroke={COLORS.white}
      strokeWidth={8}
    />
    <rect
      x={-300}
      y={-140}
      width={600}
      height={140}
      rx={18}
      fill={COLORS.purple}
      stroke={COLORS.white}
      strokeWidth={8}
    />
    <rect
      x={-320}
      y={-250}
      width={80}
      height={250}
      rx={18}
      fill={COLORS.purple}
      stroke={COLORS.white}
      strokeWidth={8}
    />
    <rect
      x={240}
      y={-250}
      width={80}
      height={250}
      rx={18}
      fill={COLORS.purple}
      stroke={COLORS.white}
      strokeWidth={8}
    />
    <line x1={-250} y1={0} x2={-250} y2={40} stroke={COLORS.white} strokeWidth={10} />
    <line x1={250} y1={0} x2={250} y2={40} stroke={COLORS.white} strokeWidth={10} />
  </g>
);

export const Tv: React.FC<{
  x: number;
  y: number;
  width?: number;
  glow?: number;
}> = ({x, y, width = 340, glow = 1}) => {
  const h = width * 0.62;
  return (
    <g transform={`translate(${x} ${y})`}>
      <Glow x={0} y={-h} r={width * 1.5} color={COLORS.blueSoft} opacity={0.14 * glow} rings={6} />
      <rect
        x={-width / 2}
        y={-h}
        width={width}
        height={h}
        rx={10}
        fill="#0A0F1F"
        stroke={COLORS.white}
        strokeWidth={9}
      />
      <rect
        x={-width / 2 + 26}
        y={-h + 26}
        width={width - 52}
        height={h - 52}
        fill={COLORS.blueSoft}
        opacity={0.55 * glow}
      />
      <rect x={-26} y={-6} width={52} height={8} fill={COLORS.white} opacity={0.5} />
    </g>
  );
};

export const WallClock: React.FC<{
  x: number;
  y: number;
  r: number;
  hour: number;
  minute: number;
}> = ({x, y, r, hour, minute}) => {
  const hand = (angleDeg: number, len: number) => {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return {x: x + Math.cos(a) * len, y: y + Math.sin(a) * len};
  };
  const hourHand = hand(((hour % 12) + minute / 60) * 30, r * 0.48);
  const minuteHand = hand(minute * 6, r * 0.78);
  return (
    <g stroke={COLORS.white} fill="none">
      <circle cx={x} cy={y} r={r * 1.25} fill={COLORS.white} opacity={0.05} stroke="none" />
      <circle cx={x} cy={y} r={r} strokeWidth={8} fill="#0A0F1F" />
      <line x1={x} y1={y} x2={hourHand.x} y2={hourHand.y} strokeWidth={10} strokeLinecap="round" />
      <line x1={x} y1={y} x2={minuteHand.x} y2={minuteHand.y} strokeWidth={7} strokeLinecap="round" />
      <circle cx={x} cy={y} r={6} fill={COLORS.white} stroke="none" />
    </g>
  );
};

export const Landline: React.FC<{
  x: number;
  y: number;
  scale?: number;
  ringing?: number;
  led?: number;
}> = ({x, y, scale = 1.3, ringing = 0, led = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {ringing > 0
      ? [0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M ${150 + i * 46} ${-190} q ${54 + i * 26} 165 0 330`}
            fill="none"
            stroke={COLORS.white}
            strokeWidth={8}
            opacity={ringing * (1 - i * 0.26)}
          />
        ))
      : null}
    <rect x={-350} y={-78} width={186} height={156} rx={12} fill="#141414" stroke={COLORS.white} strokeWidth={7} />
    <circle cx={-256} cy={-14} r={17} fill={led > 0 ? COLORS.green : '#123312'} opacity={led > 0 ? 1 : 0.7} />
    <rect x={-330} y={22} width={146} height={30} rx={6} fill="#050505" stroke={COLORS.white} strokeWidth={4} />
    <rect x={-120} y={-92} width={300} height={184} rx={18} fill={COLORS.beige} stroke={COLORS.white} strokeWidth={8} />
    <rect x={-92} y={-62} width={244} height={48} rx={8} fill="#0A0A0A" />
    {[0, 1, 2].map((row) =>
      [0, 1, 2].map((col) => (
        <circle
          key={`${row}-${col}`}
          cx={-70 + col * 74}
          cy={12 + row * 44}
          r={17}
          fill={COLORS.offWhite}
          stroke={COLORS.white}
          strokeWidth={3}
        />
      )),
    )}
    <rect x={-134} y={-166} width={328} height={74} rx={34} fill={COLORS.beige} stroke={COLORS.white} strokeWidth={8} />
    <rect x={-152} y={-158} width={64} height={58} rx={18} fill={COLORS.beige} stroke={COLORS.white} strokeWidth={8} />
    <rect x={148} y={-158} width={64} height={58} rx={18} fill={COLORS.beige} stroke={COLORS.white} strokeWidth={8} />
  </g>
);

/** Pitch-black head, huge round white eyes, rigid white smile. */
export const EntityFace: React.FC<{
  x: number;
  y: number;
  scale?: number;
  jitter?: number;
}> = ({x, y, scale = 1, jitter = 0}) => (
  <g transform={`translate(${x + jitter} ${y}) scale(${scale})`}>
    <ellipse cx={0} cy={0} rx={330} ry={400} fill={COLORS.black} />
    <circle cx={-118} cy={-70} r={80} fill={COLORS.white} />
    <circle cx={118} cy={-70} r={80} fill={COLORS.white} />
    <path d="M -182 96 Q 0 340 182 96 Q 0 232 -182 96 Z" fill={COLORS.white} />
  </g>
);
