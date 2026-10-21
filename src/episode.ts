import type {BedId} from './audio/sfx';
import {VIDEO} from './theme';

export type SceneId =
  | 'setup'
  | 'handoff'
  | 'note'
  | 'rule'
  | 'departure'
  | 'waiting'
  | 'ring'
  | 'message'
  | 'return'
  | 'door'
  | 'reveal'
  | 'choice';

export type TimedWord = {
  text: string;
  startFrame: number;
  endFrame: number;
};

export type Shot = {
  id: string;
  scene: SceneId;
  ruleIndex?: number;
  time: string;
  location: string;
  words: TimedWord[];
  bed?: BedId;
  bedVolume?: number;
  startFrame: number;
  durationInFrames: number;
};

type ShotDef = {
  id: string;
  scene: SceneId;
  ruleIndex?: number;
  time: string;
  location: string;
  narration: string[];
  bed?: BedId;
  bedVolume?: number;
  minSeconds?: number;
};

const FPS = VIDEO.fps;
const LEAD_IN = 0.3;
const LINE_PAUSE = 0.24;
const TAIL = 0.55;
const HOUSE = '14 HOLLOW RD.';

const DEFS: ShotDef[] = [
  {
    id: 'shot01',
    scene: 'setup',
    time: '7:58 PM',
    location: HOUSE,
    narration: [
      'Imagine you take a babysitting job.',
      'Three hundred dollars for one night.',
    ],
    bed: 'night',
    bedVolume: 0.55,
  },
  {
    id: 'shot02',
    scene: 'handoff',
    time: '7:58 PM',
    location: HOUSE,
    narration: [
      'The house is the last one on Hollow Road.',
      'The parents are already in their coats.',
      'The mom hands you a note.',
    ],
    bed: 'night',
    bedVolume: 0.35,
  },
  {
    id: 'shot03',
    scene: 'note',
    time: '7:58 PM',
    location: HOUSE,
    narration: ["'Follow the rules,' she says.", "'All of them.'"],
    bed: 'drone',
    bedVolume: 0.5,
  },
  {
    id: 'shot04',
    scene: 'rule',
    ruleIndex: 1,
    time: '7:58 PM',
    location: HOUSE,
    narration: ['Rule one.', 'The kids are asleep by nine.', "Don't check on them."],
    bed: 'drone',
    bedVolume: 0.5,
  },
  {
    id: 'shot05',
    scene: 'rule',
    ruleIndex: 2,
    time: '7:58 PM',
    location: HOUSE,
    narration: ['Rule two.', 'If the landline rings, let it ring.'],
    bed: 'drone',
    bedVolume: 0.5,
  },
  {
    id: 'shot06',
    scene: 'rule',
    ruleIndex: 3,
    time: '7:58 PM',
    location: HOUSE,
    narration: ['Rule three.', "If we come home before 2 am, it isn't us."],
    bed: 'drone',
    bedVolume: 0.5,
  },
  {
    id: 'shot07',
    scene: 'departure',
    time: '7:58 PM',
    location: HOUSE,
    narration: [
      'Then they drive away.',
      "You watch the blue car's tail lights disappear down the road.",
    ],
    bed: 'night',
    bedVolume: 0.35,
  },
  {
    id: 'shot08',
    scene: 'waiting',
    time: '11:48 PM',
    location: HOUSE,
    narration: [
      '11:48.',
      'The kids are asleep.',
      'The TV is the only light in the house.',
    ],
    bed: 'tv',
    bedVolume: 0.4,
  },
  {
    id: 'shot09',
    scene: 'ring',
    time: '11:48 PM',
    location: HOUSE,
    narration: [
      'Then the landline rings.',
      'You let it ring.',
      'Seven times.',
      'Then the answering machine clicks on.',
    ],
    minSeconds: 10,
  },
  {
    id: 'shot10',
    scene: 'message',
    time: '11:48 PM',
    location: HOUSE,
    narration: [
      "It's the mom.",
      "Hi, it's us. Change of plans. We're coming home early.",
    ],
    bed: 'hiss',
    bedVolume: 0.3,
  },
  {
    id: 'shot11',
    scene: 'return',
    time: '12:31 AM',
    location: HOUSE,
    narration: ['12:31.', 'Headlights in the driveway.'],
  },
  {
    id: 'shot12',
    scene: 'door',
    time: '12:31 AM',
    location: HOUSE,
    narration: [
      'The front door opens.',
      "We're home! the mom says. You can go now.",
    ],
  },
  {
    id: 'shot13',
    scene: 'reveal',
    time: '12:31 AM',
    location: HOUSE,
    narration: ["But it's only 12:31.", "And rule three says it isn't them."],
  },
  {
    id: 'shot14',
    scene: 'choice',
    time: '12:31 AM',
    location: HOUSE,
    narration: ['Do you take the money and leave,', 'or follow rule three?'],
    bed: 'tension',
    bedVolume: 0.55,
  },
];

const clampSeconds = (v: number, lo: number, hi: number): number =>
  v < lo ? lo : v > hi ? hi : v;

const buildShots = (defs: ShotDef[]): Shot[] => {
  let cursorFrame = 0;
  return defs.map((def) => {
    const words: {text: string; start: number; end: number}[] = [];
    let cursor = LEAD_IN;
    def.narration.forEach((line, lineIndex) => {
      const tokens = line.split(/\s+/).filter(Boolean);
      tokens.forEach((token) => {
        const clean = token.replace(/[^A-Za-z0-9']/g, '');
        const duration = clampSeconds(0.18 + 0.03 * clean.length, 0.24, 0.8);
        words.push({text: token, start: cursor, end: cursor + duration});
        cursor += duration;
      });
      if (lineIndex < def.narration.length - 1) {
        cursor += LINE_PAUSE;
      }
    });

    const seconds = Math.max(def.minSeconds ?? 0, cursor + TAIL);
    const durationInFrames = Math.max(1, Math.round(seconds * FPS));
    const shot: Shot = {
      id: def.id,
      scene: def.scene,
      ruleIndex: def.ruleIndex,
      time: def.time,
      location: def.location,
      bed: def.bed,
      bedVolume: def.bedVolume,
      words: words.map((w) => ({
        text: w.text,
        startFrame: Math.round(w.start * FPS),
        endFrame: Math.round(w.end * FPS),
      })),
      startFrame: cursorFrame,
      durationInFrames,
    };
    cursorFrame += durationInFrames;
    return shot;
  });
};

export const SHOTS: Shot[] = buildShots(DEFS);

export const TOTAL_DURATION_IN_FRAMES = SHOTS.reduce(
  (total, shot) => total + shot.durationInFrames,
  0,
);

export const getShotAtFrame = (frame: number): Shot => {
  let acc = 0;
  for (const shot of SHOTS) {
    if (frame < acc + shot.durationInFrames) {
      return shot;
    }
    acc += shot.durationInFrames;
  }
  return SHOTS[SHOTS.length - 1];
};

/** Frame (within a shot) at which a given word starts, with a fallback. */
export const wordFrame = (shot: Shot, needle: string, fallback: number): number => {
  const match = shot.words.find((w) =>
    w.text.toLowerCase().replace(/[^a-z0-9']/g, '').includes(needle),
  );
  return match ? match.startFrame : fallback;
};
