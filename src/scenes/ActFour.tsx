import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {Car, EntityFace, Stars, StickFigure} from '../art/primitives';
import type {Shot} from '../episode';
import {COLORS, FONT, MONO} from '../theme';
import {KineticText} from '../ui/KineticText';
import {Stage} from './shared';

/** Looking out of the front window as a car rolls into the driveway. */
export const ReturnScene: React.FC<{shot: Shot}> = ({shot}) => {
  const frame = useCurrentFrame();
  const arrive = interpolate(frame, [8, 78], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const carX = 1180 - arrive * 660;

  return (
    <Stage
      background={COLORS.black}
      overlay={<KineticText words={shot.words} />}
    >
      <defs>
        <clipPath id="yardClip">
          <rect x={100} y={320} width={880} height={900} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={1080} height={1920} fill={COLORS.black} />
      <rect x={40} y={260} width={1000} height={1020} fill="#08080C" />

      <g clipPath="url(#yardClip)">
        <g transform="translate(100 320)">
          <rect x={0} y={0} width={880} height={900} fill={COLORS.navy} />
          <Stars seed={21} count={40} width={880} height={430} opacity={0.9} />
          <rect x={0} y={600} width={880} height={300} fill={COLORS.ground} />
          <rect x={0} y={594} width={880} height={8} fill={COLORS.navyLight} />
          <polygon points={'180,900 700,900 620,600 260,600'} fill="#0C1020" />
          <g>
            <rect x={-60} y={300} width={300} height={300} fill="#0E1A38" stroke={COLORS.white} strokeWidth={7} />
            <rect x={20} y={370} width={70} height={80} fill={COLORS.yellow} opacity={0.8} />
            <rect x={140} y={370} width={70} height={80} fill={COLORS.yellow} opacity={0.55} />
            <rect x={20} y={490} width={70} height={80} fill={COLORS.yellow} opacity={0.4} />
          </g>
          <polygon
            points={`${carX - 108},750 ${carX - 560},600 ${carX - 560},930`}
            fill={COLORS.yellow}
            opacity={0.16}
          />
          <Car
            x={carX}
            y={772}
            width={215}
            body={COLORS.red}
            headlights="off"
            tailLights
          />
        </g>
      </g>

      <rect
        x={100}
        y={320}
        width={880}
        height={900}
        fill="none"
        stroke={COLORS.offWhite}
        strokeWidth={12}
      />
      <line x1={540} y1={320} x2={540} y2={1220} stroke={COLORS.offWhite} strokeWidth={10} />
      <line x1={100} y1={770} x2={980} y2={770} stroke={COLORS.offWhite} strokeWidth={10} />
      <rect x={60} y={1240} width={960} height={40} fill="#0A0A0E" />
    </Stage>
  );
};

/** The front door swings open on silhouettes standing in a white doorway. */
export const DoorScene: React.FC<{shot: Shot}> = ({shot}) => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [10, 46], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  const doorX = 310;
  const doorY = 640;
  const doorW = 460;
  const doorH = 1060;

  return (
    <Stage background={COLORS.wall} overlay={<KineticText words={shot.words} />}>
      <rect x={0} y={0} width={1080} height={1920} fill={COLORS.wall} />
      <rect x={0} y={1700} width={1080} height={220} fill={COLORS.ground} />
      <rect x={0} y={1694} width={1080} height={8} fill={COLORS.navyLight} />
      <polygon
        points={`${doorX},1700 ${doorX + doorW},1700 ${doorX + doorW + 220},1920 ${doorX - 220},1920`}
        fill={COLORS.white}
        opacity={0.12 * open}
      />
      <rect x={doorX} y={doorY} width={doorW} height={doorH} fill={COLORS.white} opacity={open} />
      <g opacity={open}>
        <StickFigure
          x={doorX + 130}
          y={1700}
          height={620}
          stroke={COLORS.black}
          headFill={COLORS.black}
          eyeColor={COLORS.white}
          eyeR={5}
        />
        <StickFigure
          x={doorX + 320}
          y={1700}
          height={660}
          stroke={COLORS.black}
          headFill={COLORS.black}
          eyeColor={COLORS.white}
          eyeR={5}
        />
      </g>
      <rect
        x={doorX}
        y={doorY}
        width={doorW * (1 - open)}
        height={doorH}
        fill={COLORS.brown}
        stroke={COLORS.white}
        strokeWidth={8}
      />
      <circle cx={doorX + doorW * (1 - open) - 40} cy={doorY + doorH * 0.5} r={14} fill={COLORS.yellow} opacity={1 - open} />
      <rect
        x={doorX - 12}
        y={doorY - 12}
        width={doorW + 24}
        height={doorH + 24}
        fill="none"
        stroke={COLORS.white}
        strokeWidth={8}
      />
    </Stage>
  );
};

/** Hard cut to the thing wearing a borrowed face. */
export const RevealScene: React.FC<{shot: Shot}> = ({shot}) => {
  const frame = useCurrentFrame();
  const shake = interpolate(frame, [0, 8], [26, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const jitter = shake * (frame % 2 === 0 ? 1 : -1);
  const scale = interpolate(frame, [0, 9], [0.78, 1.04], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const flash = interpolate(frame, [0, 5], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Stage background={COLORS.grey} overlay={<KineticText words={shot.words} textShadow="0 6px 26px rgba(0,0,0,0.55)" />}>
      <rect x={0} y={0} width={1080} height={1920} fill={COLORS.grey} />
      <EntityFace x={540} y={940} scale={scale} jitter={jitter} />
      <rect x={0} y={0} width={1080} height={1920} fill={COLORS.white} opacity={flash} />
    </Stage>
  );
};

/** The final comment-driving A/B call. */
export const ChoiceScene: React.FC<{shot: Shot}> = ({shot}) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.4)),
  });

  const panel = (
    cx: number,
    fill: string,
    label: string,
    line1: string,
    line2: string,
  ) => (
    <g transform={`translate(0 ${(1 - pop) * 40})`} opacity={pop}>
      <rect
        x={cx - 210}
        y={-150}
        width={420}
        height={300}
        rx={20}
        fill={fill}
        opacity={0.94}
        stroke={COLORS.white}
        strokeWidth={8}
      />
      <text
        x={cx}
        y={-78}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={32}
        fontWeight={700}
        letterSpacing={6}
        fill={COLORS.white}
        opacity={0.8}
      >
        {label}
      </text>
      <text
        x={cx}
        y={-4}
        textAnchor="middle"
        fontFamily={FONT}
        fontSize={46}
        fontWeight={900}
        letterSpacing={1}
        fill={COLORS.white}
      >
        {line1}
      </text>
      <text
        x={cx}
        y={54}
        textAnchor="middle"
        fontFamily={FONT}
        fontSize={46}
        fontWeight={900}
        letterSpacing={1}
        fill={COLORS.white}
      >
        {line2}
      </text>
    </g>
  );

  return (
    <Stage
      background={COLORS.black}
      overlay={
        <KineticText
          words={shot.words}
          position="top"
          padding={420}
          fontSize={72}
        />
      }
    >
      <rect x={0} y={0} width={1080} height={1920} fill={COLORS.black} />
      <rect
        x={330}
        y={520}
        width={420}
        height={980}
        fill="none"
        stroke={COLORS.white}
        strokeWidth={6}
        opacity={0.18}
      />
      <g transform="translate(540 1240)">
        {panel(-256, COLORS.blue, 'A', 'TAKE THE', 'MONEY')}
        {panel(256, COLORS.orange, 'B', 'FOLLOW', 'RULE 3')}
      </g>
      <text
        x={540}
        y={1660}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={38}
        fontWeight={700}
        letterSpacing={10}
        fill={COLORS.white}
        opacity={0.75}
      >
        COMMENT A OR B
      </text>
    </Stage>
  );
};
