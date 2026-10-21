/**
 * Procedural sound design.
 *
 * The episode ships with no audio assets, so every diegetic effect is
 * synthesised here as a 16-bit mono WAV and handed to <Audio> as a data URI.
 * All generators are deterministic (seeded noise), so a render is identical
 * every time and on every machine.
 */

const SR = 22050;

export type BedId = 'night' | 'drone' | 'tv' | 'hiss' | 'tension';

const clamp = (v: number, lo: number, hi: number): number =>
  v < lo ? lo : v > hi ? hi : v;

const W = (hz: number): number => 2 * Math.PI * hz;

/** Deterministic noise source in the range -1..1. */
const makeRng = (seed: number) => {
  let s = (seed * 2654435761) >>> 0;
  if (s === 0) {
    s = 1;
  }
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

type SampleFn = (t: number) => number;

const render = (seconds: number, fn: SampleFn): Float32Array => {
  const n = Math.max(1, Math.floor(seconds * SR));
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    out[i] = clamp(fn(i / SR), -1, 1);
  }
  return out;
};

/** Short fades so a bed restart at a hard cut never clicks. */
const finish = (samples: Float32Array): string => {
  const n = samples.length;
  const f = Math.min(Math.floor(0.02 * SR), Math.floor(n / 4));
  for (let i = 0; i < f; i++) {
    const g = i / f;
    samples[i] *= g;
    samples[n - 1 - i] *= g;
  }
  const buffer = new ArrayBuffer(44 + n * 2);
  const view = new DataView(buffer);
  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + n * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SR, true);
  view.setUint32(28, SR * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, n * 2, true);
  let o = 44;
  for (let i = 0; i < n; i++) {
    view.setInt16(o, Math.round(samples[i] * 32767), true);
    o += 2;
  }
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
};

/* ------------------------------------------------------------------ beds */

const genNight = (seconds: number): string => {
  const rng = makeRng(101);
  let windLp = 0;
  return finish(
    render(seconds, (t) => {
      const x = rng();
      windLp += 0.02 * (x - windLp);
      const wind = windLp * 2.2 * (0.6 + 0.4 * Math.sin(W(0.13 * t)));
      const period = 0.31;
      const ph = t % period;
      const idx = Math.floor(t / period);
      const frac = (Math.sin(idx * 12.9898) * 43758.5453) % 1;
      const chirp =
        ph < 0.06
          ? Math.sin(W(4300 + Math.abs(frac) * 700) * t) * Math.exp(-ph * 28)
          : 0;
      const chirp2 =
        ph > 0.13 && ph < 0.19
          ? Math.sin(W(4600) * t) * Math.exp(-(ph - 0.13) * 30) * 0.7
          : 0;
      const low = Math.sin(W(48 * t)) * 0.06 + Math.sin(W(96 * t + 1)) * 0.03;
      return wind * 0.5 + (chirp + chirp2) * 0.12 + low;
    }),
  );
};

const genDrone = (seconds: number): string => {
  const rng = makeRng(23);
  let lp = 0;
  return finish(
    render(seconds, (t) => {
      lp += 0.03 * (rng() - lp);
      const swell = 0.5 + 0.5 * Math.sin(W(0.07 * t));
      const body =
        Math.sin(W(55 * t)) * 0.35 +
        Math.sin(W(55.4 * t)) * 0.3 +
        Math.sin(W(82.5 * t + 1.2)) * 0.18 +
        Math.sin(W(110.2 * t + 0.4)) * 0.12;
      const shimmer =
        Math.sin(W(1174 * t)) * 0.02 * (0.5 + 0.5 * Math.sin(W(0.9 * t)));
      return (body * (0.35 + 0.65 * swell) + shimmer + lp * 0.25) * 0.7;
    }),
  );
};

const genTv = (seconds: number): string => {
  const rng = makeRng(17);
  let lp = 0;
  return finish(
    render(seconds, (t) => {
      const x = rng();
      lp += 0.5 * (x - lp);
      const flick = 0.7 + 0.3 * Math.sin(W(7 * t)) * Math.sin(W(0.7 * t));
      return (x - lp) * 0.16 * flick;
    }),
  );
};

const genHiss = (seconds: number): string => {
  const rng = makeRng(88);
  let lp = 0;
  return finish(
    render(seconds, (t) => {
      const x = rng();
      lp += 0.4 * (x - lp);
      const wobble = 0.75 + 0.25 * Math.sin(W(0.6 * t));
      return (x - lp) * 0.05 * wobble;
    }),
  );
};

const genTension = (seconds: number): string => {
  const rng = makeRng(31);
  let lp = 0;
  return finish(
    render(seconds, (t) => {
      lp += 0.02 * (rng() - lp);
      const p = clamp(t / seconds, 0, 1);
      const beat = 0.5 + 0.5 * Math.sin(W(0.12 * t));
      const body =
        Math.sin(W(58 * t)) * 0.3 +
        Math.sin(W(58.9 * t)) * 0.26 +
        Math.sin(W(116.4 * t + 0.7)) * 0.14;
      const strings =
        Math.sin(W(233 * t)) * 0.05 * (0.5 + 0.5 * Math.sin(W(0.33 * t)));
      const riser =
        p * 0.1 * Math.sin(W((400 + 900 * p) * t));
      return (body * (0.4 + 0.6 * beat) + strings + riser + lp * 0.3) * 0.8;
    }),
  );
};

/* ------------------------------------------------------------- one-shots */

const genPaper = (): string => {
  const rng = makeRng(7);
  let lp = 0;
  const seconds = 1.2;
  return finish(
    render(seconds, (t) => {
      const x = rng();
      lp += 0.22 * (x - lp);
      const gate = Math.pow(Math.max(0, Math.sin(t * Math.PI * 6.5)), 3);
      const fade = Math.min(1, t / 0.04) * clamp(1 - t / seconds, 0, 1);
      return ((x - lp) * 0.55 + lp * 0.5) * gate * fade * 1.2;
    }),
  );
};

const genSubHit = (seconds: number, f0: number, f1: number): string =>
  finish(
    render(seconds, (t) => {
      const p = clamp(t / seconds, 0, 1);
      const f = f0 + (f1 - f0) * Math.sqrt(p);
      const env = Math.exp(-t * 2.4) * Math.min(1, t / 0.008);
      const tone = Math.sin(W(f * t)) * 0.9 + Math.sin(W(f * 2 * t)) * 0.18;
      const click = Math.exp(-t * 90) * Math.sin(W(2600 * t)) * 0.15;
      return (tone * env + click) * 0.95;
    }),
  );

const genEngine = (
  seconds: number,
  f0: number,
  f1: number,
  fadeOut: boolean,
): string => {
  const rng = makeRng(41);
  let lp = 0;
  return finish(
    render(seconds, (t) => {
      const p = clamp(t / seconds, 0, 1);
      const f = f0 + (f1 - f0) * p;
      lp += 0.1 * (rng() - lp);
      const rumble =
        Math.sin(W(f * t)) * 0.5 +
        Math.sin(W(f * 2.01 * t + 0.5)) * 0.28 +
        Math.sin(W(f * 3.03 * t)) * 0.14;
      const am = 1 + 0.18 * Math.sin(W(18 * t));
      const env = fadeOut ? Math.pow(1 - p, 1.6) : Math.min(1, p * 6);
      return (rumble * am + lp * 0.6) * env * 0.85;
    }),
  );
};

const genGravel = (seconds: number): string => {
  const rng = makeRng(63);
  let lp = 0;
  return finish(
    render(seconds, (t) => {
      const x = rng();
      lp += 0.5 * (x - lp);
      const crunch = Math.pow(Math.max(0, Math.sin(t * Math.PI * 26)), 6);
      const env = Math.min(1, t / 0.1) * Math.pow(clamp(1 - t / seconds, 0, 1), 1.2);
      return ((x - lp) * 0.5 + lp * 0.4) * crunch * env * 1.1;
    }),
  );
};

const genRings = (count: number, period: number, on: number): string => {
  const seconds = count * period;
  return finish(
    render(seconds, (t) => {
      const ph = t % period;
      if (ph > on) {
        return 0;
      }
      const bell =
        Math.abs(Math.sin(W(1000 * t)) * Math.sin(W(20 * t))) * 0.5 +
        Math.sin(W(1250 * t)) * 0.25 +
        Math.sin(W(440 * t)) * 0.15;
      const env = Math.min(1, ph / 0.006) * Math.min(1, (on - ph) / 0.02);
      return bell * env * 1.1;
    }),
  );
};

const genClick = (): string => {
  const rng = makeRng(88);
  let lp = 0;
  const seconds = 0.9;
  return finish(
    render(seconds, (t) => {
      const x = rng();
      lp += 0.4 * (x - lp);
      const click = t < 0.05 ? Math.exp(-t * 220) * x * 1.6 : 0;
      const hiss = t > 0.02 ? (x - lp) * 0.06 : 0;
      return click + hiss;
    }),
  );
};

const genCreak = (seconds: number): string => {
  const rng = makeRng(55);
  return finish(
    render(seconds, (t) => {
      const p = clamp(t / seconds, 0, 1);
      const f = 220 + 420 * p + 40 * Math.sin(W(3.1 * t));
      const wob = 0.6 + 0.4 * Math.sin(W(11 * t));
      const saw = ((t * f) % 1) * 2 - 1;
      const noise = rng() * 0.25;
      const env = Math.sin(Math.PI * p);
      return (saw * 0.5 + noise * 0.4) * wob * env * 0.7;
    }),
  );
};

const genBassDrop = (): string => {
  const rng = makeRng(99);
  const seconds = 3;
  return finish(
    render(seconds, (t) => {
      const p = clamp(t / seconds, 0, 1);
      const f = 200 * Math.pow(0.14, Math.pow(p, 0.7));
      const env = Math.exp(-t * 1.1) * Math.min(1, t / 0.006);
      const tone =
        Math.sin(W(f * t)) +
        0.5 * Math.sin(W(f * 1.5 * t)) +
        0.3 * Math.sin(W(f * 2 * t));
      const dist = Math.tanh(tone * 1.6) * 0.7;
      const hit = Math.exp(-t * 40) * rng() * 0.5;
      return dist * env + hit * 0.6;
    }),
  );
};

const genHighRing = (seconds: number): string => {
  const rng = makeRng(12);
  let lp = 0;
  return finish(
    render(seconds, (t) => {
      lp += 0.2 * (rng() - lp);
      const env = Math.min(1, t / 0.5) * clamp(1 - t / seconds, 0, 1);
      const tone = Math.sin(W(7860 * t)) * 0.5 + Math.sin(W(7920 * t)) * 0.35;
      return tone * env * 0.16 + lp * 0.05 * env;
    }),
  );
};

/* ------------------------------------------------------------- timeline */

export const RING_COUNT = 7;
export const RING_PERIOD = 1;
export const RING_ON = 0.6;
/** Seconds into the ringing shot before the first ring lands. */
export const RING_START = 2;

/** Long ambience beds, one per shot, layered under the narration. */
export const BEDS: Record<BedId, string> = {
  night: genNight(10),
  drone: genDrone(12),
  tv: genTv(12),
  hiss: genHiss(8),
  tension: genTension(12),
};

/** Punchy one-shot effects. */
export const SFX = {
  paper: genPaper(),
  subNote: genSubHit(1.6, 120, 42),
  bassDrum: genSubHit(2, 90, 34),
  engineAway: genEngine(4.5, 70, 150, true),
  engineApproach: genEngine(4, 140, 60, false),
  gravel: genGravel(2.2),
  rings: genRings(RING_COUNT, RING_PERIOD, RING_ON),
  machineClick: genClick(),
  creak: genCreak(1.6),
  bassDrop: genBassDrop(),
  highRing: genHighRing(7),
};
