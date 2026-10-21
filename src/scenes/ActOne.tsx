import React from 'react';
import {Audio, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {Car, Stars, StickFigure} from '../art/primitives';
import {SFX} from '../audio/sfx';
import type {Shot} from '../episode';
import {wordFrame} from '../episode';
import {COLORS, MONO} from '../theme';
import {KineticText} from '../ui/KineticText';
import {NightExterior, Stage} from './shared';

export const SetupScene: React.FC<{shot: Shot}> = ({shot}) => {
  const frame = useCurrentFrame();
  const glow = 0.85 + 0.15 * Math.sin(frame / 6);

  return (
    <Stage background={COLORS.navy} overlay={<KineticText words={shot.words} />}>
      <NightExterior glow={glow} seed={5}>
        <Car
          x={300}
          y={1440}
          width={260}
          body={COLORS.blue}
          headlights="right"
          tailLights
        />
      </NightExterior>
    </Stage>
  );
};

export const HandoffScene: React.FC<{shot: Shot}> = ({shot}) => {
  const frame = useCurrentFrame();
  const handFrame = wordFrame(shot, 'hands', 34);
  const p = interpolate(frame, [handFrame, handFrame + 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const noteX = interpolate(p, [0, 1], [452, 742]);
  const noteY = interpolate(p, [0, 1], [1252, 1278]);

  return (
    <Stage
      background={COLORS.night}
      overlay={<KineticText words={shot.words} />}
      audio={
        <Sequence from={handFrame}>
          <Audio src={SFX.paper} volume={0.9} />
        </Sequence>
      }
    >
      <rect x={0} y={0} width={1080} height={1920} fill={COLORS.night} />
      <Stars seed={9} count={60} height={1100} />
      <rect x={0} y={1560} width={1080} height={360} fill={COLORS.ground} />
      <rect x={0} y={1554} width={1080} height={8} fill={COLORS.navyLight} />

      <StickFigure x={286} y={1560} height={420} />
      <StickFigure x={424} y={1560} height={470} />
      <StickFigure x={794} y={1560} height={440} pose="reach" />

      <g transform={`rotate(${(1 - p) * -8} ${noteX} ${noteY})`}>
        <rect
          x={noteX - 42}
          y={noteY - 56}
          width={84}
          height={112}
          fill={COLORS.paper}
          stroke={COLORS.greyDark}
          strokeWidth={3}
        />
        <line x1={noteX - 26} y1={noteY - 20} x2={noteX + 26} y2={noteY - 20} stroke="#C9D0DC" strokeWidth={3} />
        <line x1={noteX - 26} y1={noteY} x2={noteX + 26} y2={noteY} stroke="#C9D0DC" strokeWidth={3} />
        <line x1={noteX - 26} y1={noteY + 20} x2={noteX + 12} y2={noteY + 20} stroke="#C9D0DC" strokeWidth={3} />
      </g>
    </Stage>
  );
};

export const NoteScene: React.FC<{shot: Shot}> = ({shot}) => {
  const noteX = 70;
  const noteY = 230;
  const noteW = 940;
  const noteH = 1490;

  return (
    <Stage
      background="#0A0A0A"
      overlay={
        <KineticText
          words={shot.words}
          color={COLORS.black}
          activeColor={COLORS.red}
          fontSize={82}
          textShadow="0 4px 18px rgba(255,255,255,0.65)"
        />
      }
      audio={
        <Sequence from={2}>
          <Audio src={SFX.paper} volume={0.55} />
        </Sequence>
      }
    >
      <rect x={0} y={0} width={1080} height={1920} fill="#0A0A0A" />
      <rect
        x={noteX}
        y={noteY}
        width={noteW}
        height={noteH}
        fill={COLORS.paper}
        stroke="#D8D2C4"
        strokeWidth={4}
      />
      {Array.from({length: 12}, (_, i) => (
        <line
          key={i}
          x1={noteX}
          y1={noteY + 270 + i * 92}
          x2={noteX + noteW}
          y2={noteY + 270 + i * 92}
          stroke="#C9D6E8"
          strokeWidth={4}
        />
      ))}
      <line
        x1={noteX + 150}
        y1={noteY}
        x2={noteX + 150}
        y2={noteY + noteH}
        stroke="#E8A0A0"
        strokeWidth={4}
      />
      <text
        x={noteX + noteW / 2 + 60}
        y={noteY + 180}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={78}
        fontWeight={900}
        letterSpacing={6}
        fill={COLORS.red}
      >
        HOUSE RULES
      </text>
    </Stage>
  );
};
