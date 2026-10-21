import React from 'react';
import {AbsoluteFill, Audio, Series} from 'remotion';
import {BEDS} from './audio/sfx';
import {OptionalAudio} from './audio/OptionalAudio';
import {SHOTS, type Shot} from './episode';
import {ChoiceScene, DoorScene, RevealScene, ReturnScene} from './scenes/ActFour';
import {DepartureScene, RuleScene} from './scenes/ActTwo';
import {HandoffScene, NoteScene, SetupScene} from './scenes/ActOne';
import {MessageScene, RingScene, WaitingScene} from './scenes/ActThree';
import {COLORS} from './theme';
import {Timestamp} from './ui/Timestamp';

const ShotView: React.FC<{shot: Shot}> = ({shot}) => {
  switch (shot.scene) {
    case 'setup':
      return <SetupScene shot={shot} />;
    case 'handoff':
      return <HandoffScene shot={shot} />;
    case 'note':
      return <NoteScene shot={shot} />;
    case 'rule':
      return <RuleScene shot={shot} />;
    case 'departure':
      return <DepartureScene shot={shot} />;
    case 'waiting':
      return <WaitingScene shot={shot} />;
    case 'ring':
      return <RingScene shot={shot} />;
    case 'message':
      return <MessageScene shot={shot} />;
    case 'return':
      return <ReturnScene shot={shot} />;
    case 'door':
      return <DoorScene shot={shot} />;
    case 'reveal':
      return <RevealScene shot={shot} />;
    case 'choice':
      return <ChoiceScene shot={shot} />;
    default:
      return null;
  }
};

export const Babysitter01: React.FC = () => {
  return (
    <AbsoluteFill style={{background: COLORS.black}}>
      <Series>
        {SHOTS.map((shot) => (
          <Series.Sequence key={shot.id} durationInFrames={shot.durationInFrames}>
            <ShotView shot={shot} />
            {shot.bed ? <Audio src={BEDS[shot.bed]} volume={shot.bedVolume ?? 0.4} /> : null}
          </Series.Sequence>
        ))}
      </Series>
      <Timestamp />
      {/* Drop the narration voiceover at public/babysitter01/narration.mp3 */}
      <OptionalAudio src="babysitter01/narration.mp3" volume={1} />
    </AbsoluteFill>
  );
};
