import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import type {TimedWord} from '../episode';
import {COLORS, FONT} from '../theme';

const Word: React.FC<{
  word: TimedWord;
  frame: number;
  color: string;
  activeColor: string;
  fontSize: number;
  textShadow: string;
}> = ({word, frame, color, activeColor, fontSize, textShadow}) => {
  const age = frame - word.startFrame;
  const isActive = frame <= word.endFrame;
  const appear = interpolate(age, [0, 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = isActive
    ? interpolate(age, [0, 3, 8], [0.9, 1.12, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  return (
    <span
      style={{
        display: 'inline-block',
        color: isActive ? activeColor : color,
        opacity: (isActive ? 1 : 0.88) * appear,
        transform: `translateY(${(1 - appear) * 26}px) scale(${scale})`,
        textShadow,
        fontSize,
        fontWeight: 900,
        fontFamily: FONT,
        letterSpacing: 1,
        lineHeight: 1.08,
        textTransform: 'uppercase',
      }}
    >
      {word.text}
    </span>
  );
};

export const KineticText: React.FC<{
  words: TimedWord[];
  position?: 'top' | 'center' | 'bottom';
  color?: string;
  activeColor?: string;
  fontSize?: number;
  maxWidth?: number;
  padding?: number;
  textShadow?: string;
}> = ({
  words,
  position = 'bottom',
  color = COLORS.white,
  activeColor = COLORS.yellow,
  fontSize = 78,
  maxWidth = 900,
  padding = 180,
  textShadow = '0 6px 26px rgba(0,0,0,0.9)',
}) => {
  const frame = useCurrentFrame();

  const justifyContent =
    position === 'top' ? 'flex-start' : position === 'bottom' ? 'flex-end' : 'center';

  return (
    <AbsoluteFill
      style={{
        justifyContent,
        alignItems: 'center',
        paddingTop: position === 'top' ? padding : 0,
        paddingBottom: position === 'bottom' ? padding : 0,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignContent: 'center',
          columnGap: 22,
          rowGap: 4,
          width: '100%',
          maxWidth,
        }}
      >
        {words.map((word, index) =>
          frame >= word.startFrame ? (
            <Word
              key={index}
              word={word}
              frame={frame}
              color={color}
              activeColor={activeColor}
              fontSize={fontSize}
              textShadow={textShadow}
            />
          ) : null,
        )}
      </div>
    </AbsoluteFill>
  );
};
