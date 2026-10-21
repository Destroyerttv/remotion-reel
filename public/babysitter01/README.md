# Episode 1 — The Babysitter (Hollow Road)

Drop the narration voiceover in this folder as `narration.mp3`.

The composition probes for `public/babysitter01/narration.mp3` at render time and
plays it from frame 0 if it exists, so the render never breaks when the file is
missing. All other audio (crickets, car, landline rings, answering machine,
door creak, bass drop, tension drone) is generated procedurally in
`src/audio/sfx.ts` — no audio assets required.

The shot timeline and kinetic-typography timings are derived from the spoken
script in `src/episode.ts`. If the narration runs longer or shorter than the
derived timeline, adjust the word-duration constants in that file (or the
`minSeconds` of the shots that need more room) and the visuals will re-sync.
