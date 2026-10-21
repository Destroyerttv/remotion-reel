import React from 'react';
import {Audio, Easing, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {Car, Landline, Stars} from '../art/primitives';
import {SFX} from '../audio/sfx';
import type {Shot} from '../episode';
import {COLORS} from '../theme';
import {KineticText} from '../ui/KineticText';
import {NightExterior, RuleBadge, Stage} from './shared';

const ClosedDoor: React.FC = () => (
  <g>
    <rect
      x={330}
      y={880}
      width={420}
      height={700}
      fill={COLORS.brown}
      stroke={COLORS.white}
      strokeWidth={9}
    />
    <rect
      x={370}
      y={930}
      width={340}
      height={300}
      fill="none"
      stroke={COLORS.white}
      strokeWidth={6}
      opacity={0.5}
    />
    <circle cx={700} cy={1250} r={16} fill={COLORS.yellow} />
    <rect x={300} y={1560} width={480} height={22} fill="#1A1A1A" />
  </g>
);

const RuleShot: React.FC<{
  shot: Shot;
  index: number;
  graphic?: React.ReactNode;
  hit: string;
  hitVolume: number;
}> = ({shot, index, graphic, hit, hitVolume}) => {
  const frame = useCurrentFrame();
  const pulse = 1 + 0.02 * Math.sin(frame / 5);
  const hitFrame = shot.words.length > 0 ? shot.words[0].startFrame : 8;

  return (
    <Stage
      background={COLORS.night}
      overlay={<KineticText words={shot.words} fontSize={84} />}
      audio={
        <Sequence from={hitFrame}>
          <Audio src={hit} volume={hitVolume} />
        </Sequence>
      }
    >
      <rect x={0} y={0} width={1080} height={1920} fill={COLORS.night} />
      <Stars seed={13 + index} count={45} height={900} opacity={0.5} />
      <circle cx={540} cy={900} r={700} fill={COLORS.navy} opacity={0.6} />
      <RuleBadge index={index} x={540} y={560} scale={pulse} />
      {graphic}
    </Stage>
  );
};

export const RuleScene: React.FC<{shot: Shot}> = ({shot}) => {
  const index = shot.ruleIndex ?? 1;
  if (index === 2) {
    return (
      <RuleShot
        shot={shot}
        index={2}
        graphic={<Landline x={540} y={1150} scale={1.15} />}
        hit={SFX.subNote}
        hitVolume={0.8}
      />
    );
  }
  if (index === 3) {
    return (
      <RuleShot
        shot={shot}
        index={3}
        graphic={<ClosedDoor />}
        hit={SFX.bassDrum}
        hitVolume={0.95}
      />
    );
  }
  return (
    <RuleShot
      shot={shot}
      index={1}
      graphic={
        <g>
          <rect x={330} y={930} width={420} height={420} fill="none" stroke={COLORS.white} strokeWidth={8} opacity={0.35} />
          <line x1={330} y1={930} x2={750} y2={1350} stroke={COLORS.redBright} strokeWidth={10} opacity={0.7} />
          <line x1={750} y1={930} x2={330} y2={1350} stroke={COLORS.redBright} strokeWidth={10} opacity={0.7} />
        </g>
      }
      hit={SFX.subNote}
      hitVolume={0.8}
    />
  );
};

export const DepartureScene: React.FC<{shot: Shot}> = ({shot}) => {
  const frame = useCurrentFrame();
  const drive = interpolate(frame, [14, 112], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.quad),
  });
  const carX = 280 + drive * 1460;
  const carOpacity = interpolate(drive, [0.6, 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Stage
      background={COLORS.navy}
      overlay={<KineticText words={shot.words} />}
      audio={
        <Sequence from={8}>
          <Audio src={SFX.engineAway} volume={0.85} />
        </Sequence>
      }
    >
      <NightExterior seed={11}>
        <Car
          x={carX}
          y={1440}
          width={260}
          body={COLORS.blue}
          headlights="right"
          tailLights
          opacity={carOpacity}
        />
      </NightExterior>
    </Stage>
  );
};
