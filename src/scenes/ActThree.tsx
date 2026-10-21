import React from 'react';
import {Audio, Sequence, interpolate, spring, useCurrentFrame} from 'remotion';
import {Couch, Glow, Landline, Stars, StickFigure, Tv, WallClock} from '../art/primitives';
import {
  RING_COUNT,
  RING_ON,
  RING_PERIOD,
  RING_START,
  SFX,
} from '../audio/sfx';
import type {Shot} from '../episode';
import {COLORS, FONT, MONO, VIDEO} from '../theme';
import {KineticText} from '../ui/KineticText';
import {Stage} from './shared';

export const WaitingScene: React.FC<{shot: Shot}> = ({shot}) => {
  const frame = useCurrentFrame();
  const tvGlow = 0.8 + 0.2 * Math.sin(frame / 4);

  return (
    <Stage
      background={COLORS.wall}
      overlay={<KineticText words={shot.words} />}
    >
      <rect x={0} y={0} width={1080} height={1920} fill={COLORS.wall} />
      <Stars seed={33} count={26} height={700} opacity={0.25} />
      <Glow x={250} y={1330} r={520} color={COLORS.blueSoft} opacity={0.1 * tvGlow} rings={6} />
      <rect x={0} y={1560} width={1080} height={12} fill={COLORS.navyLight} />
      <rect x={0} y={1560} width={1080} height={360} fill="#010206" />
      <WallClock x={880} y={540} r={96} hour={11} minute={48} />
      <Tv x={250} y={1560} width={330} glow={tvGlow} />
      <Couch x={680} y={1560} />
      <StickFigure x={680} y={1560} height={330} pose="sit" />
    </Stage>
  );
};

export const RingScene: React.FC<{shot: Shot}> = ({shot}) => {
  const frame = useCurrentFrame();
  const t = frame / VIDEO.fps;
  const elapsed = t - RING_START;
  const started = elapsed >= 0 ? Math.floor(elapsed / RING_PERIOD) : -1;
  const ringingNow =
    elapsed >= 0 && started < RING_COUNT && elapsed % RING_PERIOD < RING_ON;
  const litCount = Math.min(RING_COUNT, Math.max(0, started + 1));
  const pickedUp = elapsed >= RING_COUNT * RING_PERIOD;

  const ringStartFrame = Math.round(RING_START * VIDEO.fps);
  const clickFrame = Math.round((RING_START + RING_COUNT * RING_PERIOD) * VIDEO.fps);

  return (
    <Stage
      background={COLORS.night}
      overlay={<KineticText words={shot.words} />}
      audio={
        <>
          <Sequence from={ringStartFrame}>
            <Audio src={SFX.rings} volume={0.95} />
          </Sequence>
          <Sequence from={clickFrame}>
            <Audio src={SFX.machineClick} volume={0.9} />
          </Sequence>
        </>
      }
    >
      <rect x={0} y={0} width={1080} height={1920} fill={COLORS.night} />
      <Glow x={540} y={1020} r={620} color={COLORS.beige} opacity={0.05} rings={5} />
      <rect x={0} y={1560} width={1080} height={26} fill="#161616" />
      <Landline
        x={540}
        y={1080}
        scale={1.25}
        ringing={ringingNow ? 1 : 0}
        led={pickedUp ? 1 : 0}
      />
      {Array.from({length: RING_COUNT}, (_, i) => (
        <rect
          key={i}
          x={552 - (RING_COUNT * 96) / 2 + i * 96}
          y={1660}
          width={70}
          height={24}
          rx={6}
          fill={i < litCount ? COLORS.redBright : '#1E1E1E'}
        />
      ))}
      {pickedUp ? (
        <text
          x={540}
          y={1780}
          textAnchor="middle"
          fontFamily={MONO}
          fontSize={34}
          fontWeight={700}
          letterSpacing={8}
          fill={COLORS.green}
        >
          MACHINE ON
        </text>
      ) : null}
    </Stage>
  );
};

export const MessageScene: React.FC<{shot: Shot}> = ({shot}) => {
  const frame = useCurrentFrame();
  const bubbleStart = shot.words.length > 0 ? shot.words[0].startFrame + 6 : 12;
  const pop = spring({
    frame: frame - bubbleStart,
    fps: VIDEO.fps,
    config: {damping: 14, stiffness: 120},
  });
  const scale = interpolate(pop, [0, 1], [0.82, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const lines = ["HI, IT'S US.", 'CHANGE OF PLANS.', "WE'RE COMING HOME EARLY."];

  return (
    <Stage
      background={COLORS.night}
      overlay={<KineticText words={shot.words} />}
    >
      <rect x={0} y={0} width={1080} height={1920} fill={COLORS.night} />
      <Glow x={300} y={1020} r={560} color={COLORS.beige} opacity={0.05} rings={5} />
      <rect x={0} y={1560} width={1080} height={26} fill="#161616" />
      <Landline x={300} y={1080} scale={1.15} led={1} />
      <g transform={`translate(${620} ${700}) scale(${scale})`}>
        <rect
          x={-300}
          y={-220}
          width={600}
          height={440}
          rx={28}
          fill="#0C1428"
          stroke={COLORS.green}
          strokeWidth={8}
        />
        <polygon points={'-120,216 -60,216 -150,320'} fill="#0C1428" stroke={COLORS.green} strokeWidth={8} />
        <text
          x={0}
          y={-96}
          textAnchor="middle"
          fontFamily={MONO}
          fontSize={30}
          fontWeight={700}
          letterSpacing={4}
          fill={COLORS.green}
        >
          MESSAGE 1
        </text>
        {lines.map((line, i) => (
          <text
            key={line}
            x={0}
            y={-20 + i * 74}
            textAnchor="middle"
            fontFamily={FONT}
            fontSize={40}
            fontWeight={800}
            letterSpacing={1}
            fill={COLORS.white}
          >
            {line}
          </text>
        ))}
      </g>
    </Stage>
  );
};
