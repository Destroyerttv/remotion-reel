# Remotion Reel — Babysitter01

An animated vertical short (1080x1920, 30fps) built programmatically with
[Remotion](https://www.remotion.dev). Episode 1, "The Babysitter" on Hollow Road.

This is a **Node.js project**, not a static website: the video is composed in
React/TypeScript and rendered by Remotion with a headless browser. It therefore
needs `npm install` and a computer — it cannot be rendered on the phone.

## Requirements

- Node.js 18 or newer
- npm

## Run it on a computer

```bash
npm install         # once
npm run studio      # live preview at http://localhost:3000
```

`npm run studio` is the fastest way to watch and scrub the timeline while you
tweak timings, type or colour.

## Render the finished video

```bash
npm run render      # writes out/babysitter01.mp4
```

Other useful commands:

```bash
npm run still       # writes out/frame.png (a single frame)
npm run typecheck   # tsc, no emit
```

The composition is `Babysitter01`, entered through `src/index.ts`. Output is
1080x1920 H.264 (CRF 16, yuv420p) per `remotion.config.ts`, ready for Reels,
Shorts and TikTok.

## Narration

Drop the voiceover at `public/babysitter01/narration.mp3`. It plays from frame 0
if present; if the file is missing the render simply runs silent instead of
failing. All other sound — crickets, wind, the landline, the answering machine,
the car, the door, the bass drop, the tension drone — is generated procedurally
in `src/audio/sfx.ts`, so no audio assets are required.

## Adjusting the timing

The shot list and every kinetic-typography timing live in `src/episode.ts`.
Durations are derived from the spoken script's word lengths. If the narration
runs long or short, tune the word-duration constants or the `minSeconds` of the
affected shots and the visuals re-sync.

## Layout

```
src/
  index.ts          entry point
  Root.tsx          composition registration
  Babysitter01.tsx  main composition (shot series, timestamp, narration)
  episode.ts        shot list + word-level timeline
  theme.ts          dimensions, palette, fonts
  art/primitives.tsx  reusable flat-vector shapes
  scenes/           the four acts + shared framing
  ui/               kinetic typography and the timestamp overlay
  audio/            procedural sound design
```
