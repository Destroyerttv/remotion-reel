import React from 'react';
import {Composition} from 'remotion';
import {Babysitter01} from './Babysitter01';
import {TOTAL_DURATION_IN_FRAMES} from './episode';
import {VIDEO} from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Babysitter01"
      component={Babysitter01}
      durationInFrames={TOTAL_DURATION_IN_FRAMES}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
  );
};
