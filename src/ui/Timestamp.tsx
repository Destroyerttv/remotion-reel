import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {getShotAtFrame} from '../episode';
import {COLORS, MONO} from '../theme';

/** Persistent top-left camera-style overlay: part marker, clock, address. */
export const Timestamp: React.FC = () => {
  const frame = useCurrentFrame();
  const shot = getShotAtFrame(frame);
  const blink = Math.floor(frame / 15) % 2 === 0;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: 60, left: 58, fontFamily: MONO}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              background: COLORS.redBright,
              opacity: blink ? 1 : 0.25,
            }}
          />
          <span
            style={{
              color: COLORS.white,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 5,
            }}
          >
            PART 1
          </span>
        </div>
        <div
          style={{
            color: COLORS.white,
            fontSize: 46,
            fontWeight: 700,
            letterSpacing: 2,
            marginTop: 10,
          }}
        >
          {shot.time}
        </div>
        <div
          style={{
            color: 'rgba(255,255,255,0.62)',
            fontSize: 26,
            letterSpacing: 4,
            marginTop: 4,
          }}
        >
          {shot.location}
        </div>
        <div
          style={{
            width: 190,
            height: 3,
            background: 'rgba(255,255,255,0.35)',
            marginTop: 12,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
